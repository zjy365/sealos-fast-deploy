import MyIcon from '@/components/Icon';
import Tabs from '@/components/Tabs';
import type { QueryType } from '@/types';
import { Box, Flex, FormControl, Grid, Input, useTheme } from '@chakra-ui/react';
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
    mb: 4,
    bg: 'white'
  };

  const headerStyles = {
    py: 4,
    pl: '46px',
    fontSize: '2xl',
    color: 'myGray.900',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'myWhite.600'
  };

  return (
    <>
      <Grid
        height={'100%'}
        templateColumns={'220px 1fr'}
        gridGap={5}
        alignItems={'start'}
        pl={`${pxVal}px`}>
        <Box>
          <Tabs
            list={[
              { id: 'form', label: 'Config Form' },
              { id: 'yaml', label: 'YAML File' }
            ]}
            activeId={'form'}
            onChange={(id) => {
              router.push({
                pathname: '/deploy',
                query: { ...router.query, type: id }
              });
            }}
          />
        </Box>

        <Box
          id={'form-container'}
          pr={`${pxVal}px`}
          height={'100%'}
          position={'relative'}
          overflowY={'scroll'}>
          {/* base info */}
          <Box id={'baseInfo'} {...boxStyles}>
            <Box {...headerStyles}>
              <MyIcon name={'formInfo'} mr={5} w={'20px'} color={'myGray.500'} />
              {templateName ? `${templateName} config` : 'Config'}
            </Box>
            <Box px={'42px'} py={'24px'}>
              {formSource?.inputs?.map((item: any) => {
                return (
                  <FormControl key={item?.key} mb={7} isInvalid={!!errors.appName} w={'500px'}>
                    <Flex alignItems={'center'}>
                      <Label w={80}>{item.label}</Label>
                      <Input
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
          </Box>
        </Box>
      </Grid>
    </>
  );
};

export default Form;
