import MyIcon from '@/components/Icon';
import Tabs from '@/components/Tabs';
import { Box, Flex, Text, Textarea } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Form from './components/Form';

const Develop = () => {
  const router = useRouter();
  const [activeId, setActiveId] = useState('form');
  const [inputVal, setInputVal] = useState('');

  return (
    <Flex flexDirection={'column'} alignItems={'center'} h={'100%'}>
      <Flex
        cursor={'pointer'}
        zIndex={99}
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
        <MyIcon ml={'46px'} name="arrowLeft" color={'#24282C'} w={'16px'} h={'16px'}></MyIcon>
        <Text>返回</Text>
      </Flex>
      <Flex w="100%" h="100%" pt="60px" flexDirection={'column'} alignItems="center">
        <Box>
          <Tabs
            w="240px"
            list={[
              { id: 'form', label: 'YAML' },
              { id: 'yaml', label: 'List' },
              { id: 'effect', label: 'Effect' }
            ]}
            activeId={activeId}
            onChange={(id) => {
              setActiveId(id);
            }}
          />
        </Box>
        <Box w="800px" maxW={'1024px'} minW="800px">
          <Textarea
            h={'550px'}
            maxH={'100%'}
            value={inputVal}
            resize={'none'}
            bg={'myWhite.300'}
            placeholder={''}
            onChange={(e) => setInputVal(e.target.value)}
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Develop;
