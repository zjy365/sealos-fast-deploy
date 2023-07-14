import { updateRepo } from '@/api/platform';
import MyIcon from '@/components/Icon';
import { GET } from '@/services/request';
import { TemplateType } from '@/types/app';
import {
  Box,
  Flex,
  Grid,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

function Index() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // const { data: FastDeployTemplates } = useQuery(['cloneTemplte'], () => GET('/api/cloneRepo'));
  let FastDeployTemplates: any = [];
  console.log(FastDeployTemplates);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    searchTemplate(e.target.value);
  };

  const searchTemplate = (value: string) => {
    const filterData = FastDeployTemplates?.filter((item: TemplateType) => {
      return item?.spec?.title?.toLowerCase().includes(value.toLowerCase());
    });
    setSearchResults(filterData);
  };

  const filterData = useMemo(() => {
    return searchValue ? searchResults : FastDeployTemplates;
  }, [FastDeployTemplates, searchResults, searchValue]);

  const goDeploy = (name: string) => {
    if (!name) return;
    const str = name.toLowerCase();
    router.push({
      pathname: '/deploy',
      query: {
        type: 'form',
        templateName: str
      }
    });
  };

  useEffect(() => {
    if (router.query?.templateName) {
      router.push({
        pathname: '/deploy',
        query: {
          templateName: router.query?.templateName
        }
      });
    }
    (async () => {
      const result = await updateRepo();
      console.log(result);
    })();
  }, []);

  return (
    <Box flexDirection={'column'} height={'100%'} backgroundColor={'#edeff0'}>
      <Flex justifyContent={'center'} flexDirection={'column'} alignItems={'center'} pt={'24px'}>
        <Text color={'24282C'} fontSize={'48px'} fontWeight={500}>
          模板商店
        </Text>
        <Text color={'5A646E'} fontSize={'12px'} fontWeight={500}>
          为您预先构建解决方案，体验一键部署应用
        </Text>
        <InputGroup mt={'24px'} maxWidth={'674px'}>
          <InputLeftElement pointerEvents="none" pt={'6px'}>
            <svg
              color="#24282C"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M21.71 20.29L18 16.61C19.4401 14.8144 20.1375 12.5353 19.9488 10.2413C19.7601 7.9473 18.6997 5.81278 16.9855 4.27664C15.2714 2.7405 13.0338 1.91951 10.7329 1.98247C8.43204 2.04543 6.24273 2.98756 4.61515 4.61514C2.98757 6.24272 2.04543 8.43203 1.98247 10.7329C1.91951 13.0338 2.74051 15.2714 4.27665 16.9855C5.81279 18.6997 7.94731 19.7601 10.2413 19.9488C12.5353 20.1375 14.8144 19.4401 16.61 18L20.29 21.68C20.383 21.7737 20.4936 21.8481 20.6154 21.8989C20.7373 21.9497 20.868 21.9758 21 21.9758C21.132 21.9758 21.2627 21.9497 21.3846 21.8989C21.5064 21.8481 21.617 21.7737 21.71 21.68C21.8902 21.4935 21.991 21.2443 21.991 20.985C21.991 20.7257 21.8902 20.4765 21.71 20.29ZM11 18C9.61553 18 8.26216 17.5895 7.11101 16.8203C5.95987 16.0511 5.06266 14.9579 4.53285 13.6788C4.00303 12.3997 3.86441 10.9922 4.13451 9.63436C4.4046 8.2765 5.07129 7.02922 6.05026 6.05025C7.02922 5.07128 8.2765 4.4046 9.63437 4.1345C10.9922 3.8644 12.3997 4.00303 13.6788 4.53284C14.9579 5.06265 16.0511 5.95986 16.8203 7.111C17.5895 8.26215 18 9.61553 18 11C18 12.8565 17.2625 14.637 15.9498 15.9497C14.637 17.2625 12.8565 18 11 18Z"
                fill="#24282C"
              />
            </svg>
          </InputLeftElement>
          <Input
            h={'42px'}
            backgroundColor={'#FFF'}
            type="tel"
            placeholder="模板名称"
            onChange={handleSearch}
          />
        </InputGroup>
      </Flex>
      <Flex p={'32px'} minW={'750px'} maxW={'1448px'} m={'0 auto'} justifyContent={'center'}>
        <Grid
          w={'100%'}
          gridTemplateColumns="repeat(auto-fit, minmax(328px, 328px))"
          gridGap={'24px'}>
          {filterData?.map((item: TemplateType) => {
            return (
              <Flex
                key={item.spec.title}
                flexDirection={'column'}
                w={'328px'}
                minH={'214px'}
                p={'24px'}
                borderRadius={'6px'}
                backgroundColor={'#fff'}
                border={'1px solid #DEE0E2'}>
                <Box
                  p={'6px'}
                  w={'48px'}
                  h={'48px'}
                  borderRadius={'4px'}
                  backgroundColor={'#fff'}
                  border={' 1px solid #DEE0E2'}>
                  <Image src={item?.spec?.icon} alt="" width={'36px'} height={'36px'} />
                </Box>
                <Flex mt={'12px'} alignItems={'center'} justifyContent="space-between">
                  <Text fontSize={'24px'} fontWeight={600} color={'#24282C'}>
                    {item?.spec?.title}
                  </Text>
                  <Flex
                    cursor={'pointer'}
                    onClick={() => goDeploy(item?.spec?.title)}
                    justifyContent={'center'}
                    alignItems={'center'}
                    w={'60px'}
                    h={'28px'}
                    borderRadius={'4px'}
                    border={'1px solid #DEE0E2'}
                    backgroundColor={'#F4F6F8'}>
                    Deploy
                  </Flex>
                </Flex>

                <Text
                  css={`
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  `}
                  mt={'8px'}
                  fontSize={'12px'}
                  color={'5A646E'}
                  fontWeight={400}>
                  {item?.spec?.description}
                </Text>
                <Flex mt={'12px'} justifyContent={'space-between'} alignItems={'center'}>
                  <Text fontSize={'12px'} color={'5A646E'} fontWeight={400}>
                    By {item?.spec?.author}
                  </Text>
                  <Box>
                    <MyIcon name="jump"></MyIcon>
                  </Box>
                </Flex>
              </Flex>
            );
          })}
        </Grid>
      </Flex>
    </Box>
  );
}

export default Index;
