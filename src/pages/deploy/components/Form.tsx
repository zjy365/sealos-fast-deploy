import MyIcon from '@/components/Icon';
import Tabs from '@/components/Tabs';
import type { QueryType } from '@/types';
import { Box, Flex, FormControl, Grid, Input, useTheme, Text } from '@chakra-ui/react';
import { customAlphabet } from 'nanoid';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';

const Form = ({
  formHook,
  pxVal,
  formSource
}: {
  formHook: UseFormReturn;
  pxVal: number;
  formSource: any;
}) => {
  if (!formHook) return null;
  const { t } = useTranslation();
  const router = useRouter();
  const { name, templateName } = router.query as QueryType;
  const theme = useTheme();
  const isEdit = useMemo(() => !!name, [name]);

  const {
    register,
    control,
    setValue,
    getValues,
    formState: { errors }
  } = formHook;

  const Label = ({
    children,
    w = 'auto',
    ...props
  }: {
    children: string;
    w?: number | 'auto';
    [key: string]: any;
  }) => (
    <Box
      flex={`0 0 ${w === 'auto' ? 'auto' : `${w}px`}`}
      {...props}
      color={'#333'}
      userSelect={'none'}>
      {children}
    </Box>
  );

  const boxStyles = {
    border: theme.borders.base,
    borderRadius: 'sm',
    bg: 'white'
  };

  const headerStyles = {
    py: 4,
    pl: '42px',
    fontSize: '2xl',
    color: 'myGray.900',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'myWhite.600'
  };

  console.log(formSource?.inputs);

  return (
    <Box flexGrow={1} id={'baseInfo'} {...boxStyles}>
      <Box {...headerStyles}>
        <MyIcon name={'formInfo'} mr={5} w={'24px'} color={'myGray.500'} />
        基础配置
      </Box>
      {formSource?.tabs?.length > 0 ? (
        <Box px={'42px'} py={'24px'}>
          {formSource?.inputs?.map((item: any) => {
            return (
              <FormControl key={item?.key} mb={7} isInvalid={!!errors.appName} w={'500px'}>
                <Flex alignItems={'center'}>
                  <Label w={80}>{item.label}</Label>
                  <Input
                    ml={'20px'}
                    defaultValue={item?.default}
                    disabled={isEdit}
                    autoFocus={true}
                    placeholder={item?.description}
                    {...register(item?.key, {
                      required: item?.required
                    })}
                  />
                </Flex>
              </FormControl>
            );
          })}
        </Box>
      ) : (
        <Flex
          justifyContent={'center'}
          alignItems="center"
          h={'160px'}
          w={'100%'}
          flexDirection="column">
          <Flex
            border={'1px dashed #9CA2A8'}
            borderRadius="50%"
            w={'48px'}
            h={'48px'}
            justifyContent="center"
            alignItems={'center'}>
            <MyIcon color={'#7B838B'} name="empty"></MyIcon>
          </Flex>
          <Text mt={'12px'} fontSize={14} color={'#5A646E'}>
            当前应用不需要配置任何参数
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default Form;
