import { getTemplate, postDeployApp } from '@/api/app';
import { editModeMap } from '@/constants/editApp';
import { useConfirm } from '@/hooks/useConfirm';
import { useLoading } from '@/hooks/useLoading';
import { useToast } from '@/hooks/useToast';
import { useGlobalStore } from '@/store/global';
import { getServiceEnv } from '@/store/static';
import type { QueryType, YamlItemType } from '@/types';
import { TemplateSource } from '@/types/app';
import { serviceSideProps } from '@/utils/i18n';
import { generateYamlList, parseTemplateString } from '@/utils/json-yaml';
import { Box, Flex } from '@chakra-ui/react';
import JSYAML from 'js-yaml';
import { has, isObject, mapValues, reduce } from 'lodash';
import debounce from 'lodash/debounce';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Form from './components/Form';
import Header from './components/Header';
import Yaml from './components/Yaml';

const ErrorModal = dynamic(() => import('./components/ErrorModal'));

const EditApp = ({ appName, tabType }: { appName?: string; tabType: string }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const { templateName } = router.query as QueryType;

  const { Loading, setIsLoading } = useLoading();
  const [forceUpdate, setForceUpdate] = useState(false);
  const { title, applyBtnText, applyMessage, applySuccess, applyError } = editModeMap(!!appName);
  const [templateSource, setTemplateSource] = useState<TemplateSource>();
  const [yamlList, setYamlList] = useState<YamlItemType[]>([]);
  const [correctYaml, setCorrectYaml] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { openConfirm, ConfirmChild } = useConfirm({
    content: applyMessage
  });

  const { screenWidth } = useGlobalStore();
  const pxVal = useMemo(() => {
    const val = Math.floor((screenWidth - 1050) / 2);
    if (val < 20) {
      return 20;
    }
    return val;
  }, [screenWidth]);

  const getFormDefaultValues = (templateSource: TemplateSource | undefined) => {
    const inputs = templateSource?.source?.inputs;
    return reduce(
      inputs,
      (acc, item) => {
        // @ts-ignore
        acc[item.key] = item.default;
        return acc;
      },
      {}
    );
  };

  // form
  const formHook = useForm({
    defaultValues: getFormDefaultValues(templateSource)
  });

  const formOnchangeDebounce = debounce(async (data: any) => {
    try {
      if (!templateSource) return;
      const yamlString = templateSource.yamlList?.map((item) => JSYAML.dump(item)).join('---\n');
      const output = mapValues(templateSource?.source.defaults, (value) => value.value);
      const generateStr = parseTemplateString(yamlString, /\$\{\{\s*(.*?)\s*\}\}/g, {
        ...templateSource?.source,
        inputs: data,
        defaults: output
      });
      setCorrectYaml(generateStr);
      setYamlList(generateYamlList(generateStr));
    } catch (error) {
      console.log(error);
    }
  }, 200);
  // watch form change, compute new yaml
  formHook.watch((data: any) => {
    data && formOnchangeDebounce(data);
    setForceUpdate(!forceUpdate);
  });

  const submitSuccess = async () => {
    setIsLoading(true);
    try {
      const yamls = JSYAML.loadAll(correctYaml).map((item) => JSYAML.dump(item));
      await postDeployApp(yamls);
      toast({
        title: t(applySuccess),
        status: 'success'
      });
    } catch (error) {
      setErrorMessage(JSON.stringify(error));
    }
    setIsLoading(false);
  };

  const submitError = () => {
    formHook.getValues();
    function deepSearch(obj: any): string {
      if (has(obj, 'message')) {
        return obj.message;
      }
      for (let key in obj) {
        if (isObject(obj[key])) {
          let message = deepSearch(obj[key]);
          if (message) {
            return message;
          }
        }
      }
      return t('Submit Error');
    }

    toast({
      title: deepSearch(formHook.formState.errors),
      status: 'error',
      position: 'top',
      duration: 3000,
      isClosable: true
    });
  };

  const getTemplateData = async () => {
    if (!templateName) {
      toast({
        title: t('TemplateNameError'),
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true
      });
      return null;
    }
    const res: TemplateSource = await getTemplate(templateName);
    setTemplateSource(res);
    try {
      const yamlString = res.yamlList?.map((item) => JSYAML.dump(item)).join('---\n');
      const output = mapValues(res?.source.defaults, (value) => value.value);
      const generateStr = parseTemplateString(yamlString, /\$\{\{\s*(.*?)\s*\}\}/g, {
        ...res?.source,
        defaults: output,
        inputs: getFormDefaultValues(res)
      });
      setCorrectYaml(generateStr);
      setYamlList(generateYamlList(generateStr));
    } catch (err) {
      console.log(err, 'getTemplateData');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await getTemplateData();
        await getServiceEnv();
      } catch (error) {}
    })();
  }, []);

  return (
    <>
      <Flex
        flexDirection={'column'}
        alignItems={'center'}
        h={'100%'}
        minWidth={'1024px'}
        backgroundColor={'#F3F4F5'}>
        <Header
          appName={''}
          title={title}
          yamlList={yamlList}
          applyBtnText={applyBtnText}
          applyCb={() => formHook.handleSubmit(openConfirm(submitSuccess), submitError)()}
        />

        <Box flex={'1 0 0'} h={0} w={'100%'} pb={4}>
          {tabType === 'form' ? (
            <Form formHook={formHook} pxVal={pxVal} formSource={templateSource?.source} />
          ) : (
            <Yaml yamlList={yamlList} pxVal={pxVal} />
          )}
        </Box>
      </Flex>
      <ConfirmChild />
      <Loading />
      {!!errorMessage && (
        <ErrorModal title={applyError} content={errorMessage} onClose={() => setErrorMessage('')} />
      )}
    </>
  );
};

export async function getServerSideProps(content: any) {
  const appName = content?.query?.name || '';
  const tabType = content?.query?.type || 'form';

  return {
    props: {
      appName,
      tabType,
      ...(await serviceSideProps(content))
    }
  };
}

export default EditApp;
