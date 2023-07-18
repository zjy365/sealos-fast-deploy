import { getTemplate, postDeployApp } from '@/api/app';
import { editModeMap } from '@/constants/editApp';
import { useConfirm } from '@/hooks/useConfirm';
import { useLoading } from '@/hooks/useLoading';
import { useToast } from '@/hooks/useToast';
import { GET } from '@/services/request';
import { useGlobalStore } from '@/store/global';
import { getServiceEnv } from '@/store/static';
import type { QueryType, YamlItemType } from '@/types';
import { TemplateSource, TemplateType } from '@/types/app';
import { serviceSideProps } from '@/utils/i18n';
import { generateYamlList, parseTemplateString } from '@/utils/json-yaml';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
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
import ReadMe from './components/ReadMe';

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
  const { screenWidth } = useGlobalStore();

  const { data: FastDeployTemplates } = useQuery(['cloneTemplte'], () => GET('/api/listTemplate'));

  const templateDetail: TemplateType = FastDeployTemplates?.find(
    (item: any) => item?.spec?.title?.toLowerCase() === templateName?.toLowerCase()
  );

  const { openConfirm, ConfirmChild } = useConfirm({
    content: applyMessage
  });

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
      // yamls.forEach((item) => {
      //   const str = JSYAML.dump(item);
      //   console.log(str);
      // }),
      const result = await postDeployApp(yamls);
      console.log(result);

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
      <Flex flexDirection={'column'} alignItems={'center'} h={'100%'} minWidth={'1024px'}>
        <Flex
          position={'fixed'}
          top={0}
          left={0}
          w={'100%'}
          h={'50px'}
          borderBottom={'1px solid #DEE0E2'}
          justifyContent={'start'}
          alignItems={'center'}
          backgroundColor={'rgba(255, 255, 255)'}
          backdropBlur={'100px'}>
          <Breadcrumb
            fontWeight={500}
            fontSize={16}
            textDecoration={'none'}
            ml={'46px'}
            color={'#7B838B'}>
            <BreadcrumbItem textDecoration={'none'}>
              <BreadcrumbLink _hover={{ color: '#219BF4', textDecoration: 'none' }} href="/">
                模板列表
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem color={'#262A32'} isCurrentPage={router.pathname === 'deploy'}>
              <BreadcrumbLink _hover={{ color: '#219BF4', textDecoration: 'none' }} href="#">
                {templateDetail?.spec?.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>

        <Flex
          mt={'50px'}
          flexDirection={'column'}
          width={'100%'}
          flexGrow={1}
          backgroundColor={'rgba(255, 255, 255, 0.90)'}>
          <Header
            templateDetail={templateDetail}
            appName={''}
            title={title}
            yamlList={yamlList}
            applyBtnText={applyBtnText}
            applyCb={() => formHook.handleSubmit(openConfirm(submitSuccess), submitError)()}
          />
          <Flex w={{ md: '1000px', base: '800px' }} m={'32px auto'} flexDirection="column">
            <Form formHook={formHook} pxVal={pxVal} formSource={templateSource?.source} />
            {/* <Yaml yamlList={yamlList} pxVal={pxVal}></Yaml> */}
            <ReadMe templateDetail={templateDetail} />
          </Flex>
        </Flex>
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
