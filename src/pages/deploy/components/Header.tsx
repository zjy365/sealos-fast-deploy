import React, { useCallback } from 'react';
import { Box, Flex, Button, Text, Image } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import JSZip from 'jszip';
import type { YamlItemType } from '@/types/index';
import { downLoadBold } from '@/utils/tools';
import dayjs from 'dayjs';
import { useGlobalStore } from '@/store/global';
import { useTranslation } from 'next-i18next';
import { useQuery } from '@tanstack/react-query';
import { GET } from '@/services/request';
import { TemplateType } from '@/types/app';
import MyIcon from '@/components/Icon';

const Header = ({
  appName,
  title,
  yamlList,
  applyCb,
  applyBtnText,
  templateDetail
}: {
  appName: string;
  title: string;
  yamlList: YamlItemType[];
  applyCb: () => void;
  applyBtnText: string;
  templateDetail: TemplateType;
}) => {
  const { t } = useTranslation();

  const handleExportYaml = useCallback(async () => {
    const zip = new JSZip();
    yamlList.forEach((item) => {
      zip.file(item.filename, item.value);
    });
    const res = await zip.generateAsync({ type: 'blob' });
    downLoadBold(
      res,
      'application/zip',
      appName ? `${appName}.zip` : `yaml${dayjs().format('YYYYMMDDHHmmss')}.zip`
    );
  }, [appName, yamlList]);

  return (
    <Flex
      w={'1000px'}
      m={'0 auto'}
      h={'80px'}
      mt={'32px'}
      alignItems={'center'}
      backgroundColor={'rgba(255, 255, 255, 0.90)'}>
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
        w={'80px'}
        h={'80px'}
        borderRadius={'8px'}
        backgroundColor={'#fff'}
        border={' 1px solid #DEE0E2'}>
        <Image src={templateDetail?.spec?.icon} alt="" width={'60px'} height={'60px'} />
      </Flex>
      <Flex ml={'24px'} w="520px" flexDirection={'column'}>
        <Flex alignItems={'center'}>
          <Text fontSize={'24px'} fontWeight={600} color={'#24282C'}>
            {templateDetail?.spec?.title}
          </Text>
          <MyIcon ml={'16px'} name="jump"></MyIcon>
          <Text ml={'16px'} fontSize={'12px'} color={'5A646E'} fontWeight={400}>
            By {templateDetail?.spec?.author}
          </Text>
        </Flex>
        <Text
          overflow={'hidden'}
          noOfLines={1}
          textOverflow={'ellipsis'}
          mt={'8px'}
          fontSize={'12px'}
          color={'5A646E'}
          fontWeight={400}>
          {templateDetail?.spec?.description}
        </Text>
      </Flex>

      <Button
        h={'40px'}
        ml={'auto'}
        mr={5}
        px={4}
        minW={'140px'}
        bg={'myWhite.600'}
        borderColor={'myGray.200'}
        variant={'base'}
        onClick={handleExportYaml}>
        {t('Export')} Yaml
      </Button>
      <Button px={4} minW={'140px'} h={'40px'} variant={'primary'} onClick={applyCb}>
        {t(applyBtnText)}
      </Button>
    </Flex>
  );
};

export default Header;
