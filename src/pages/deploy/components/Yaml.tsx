import MyIcon from '@/components/Icon';
import Tabs from '@/components/Tabs';
import YamlCode from '@/components/YamlCode/index';
import type { QueryType, YamlItemType } from '@/types';
import { useCopyData } from '@/utils/tools';
import { Box, Flex, Grid, useTheme } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './index.module.scss';

const Yaml = ({ yamlList = [], pxVal }: { yamlList: YamlItemType[]; pxVal: number }) => {
  const theme = useTheme();
  const router = useRouter();
  const { name } = router.query as QueryType;
  const { copyData } = useCopyData();
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Grid
      h={'100%'}
      templateColumns={'220px 1fr'}
      gridGap={5}
      alignItems={'start'}
      px={`${pxVal}px`}
    >
      <Box>
        <Tabs
          list={[
            { id: 'form', label: 'Config Form' },
            { id: 'yaml', label: 'YAML File' }
          ]}
          activeId={'yaml'}
          onChange={(id) => {
            router.push({
              pathname: '/deploy',
              query: { ...router.query, type: id }
            });
          }}
        />
        <Box mt={3} borderRadius={'sm'} overflow={'hidden'} bg={'white'}>
          {yamlList.map((file, index) => (
            <Box
              key={file.filename}
              px={5}
              py={3}
              cursor={'pointer'}
              borderLeft={'2px solid'}
              alignItems={'center'}
              h={'48px'}
              _hover={{
                backgroundColor: 'myWhite.400'
              }}
              {...(index === selectedIndex
                ? {
                    fontWeight: 'bold',
                    borderColor: 'myGray.900',
                    backgroundColor: 'myWhite.600 !important'
                  }
                : {
                    color: 'myGray.500',
                    borderColor: 'myGray.200',
                    backgroundColor: 'transparent'
                  })}
              onClick={() => setSelectedIndex(index)}
            >
              {file.filename}
            </Box>
          ))}
        </Box>
      </Box>
      {!!yamlList[selectedIndex] && (
        <Flex
          className={styles.codeBox}
          flexDirection={'column'}
          h={'100%'}
          overflow={'hidden'}
          border={theme.borders.base}
          borderRadius={'md'}
          position={'relative'}
        >
          <Flex px={8} py={4} bg={'myWhite.400'}>
            <Box flex={1} fontSize={'xl'} color={'myGray.900'} fontWeight={'bold'}>
              {yamlList[selectedIndex].filename}
            </Box>
            <Box
              cursor={'pointer'}
              color={'myGray.600'}
              _hover={{ color: '#219BF4' }}
              onClick={() => copyData(yamlList[selectedIndex].value)}
            >
              <MyIcon name="copy" w={'16px'} />
            </Box>
          </Flex>
          <Box flex={1} h={0} overflow={'auto'} bg={'#ffffff'} p={4}>
            <YamlCode className={styles.code} content={yamlList[selectedIndex].value} />
          </Box>
        </Flex>
      )}
    </Grid>
  );
};

export default Yaml;
