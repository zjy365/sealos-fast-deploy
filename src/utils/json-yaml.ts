import { YamlItemType } from '@/types';
import { TemplateType } from '@/types/app';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz');
import { cloneDeep } from 'lodash';
export const replaceYamlVariate = (str: string) => str.replace(/{{(.*?)}}/g, '__TEMP__$1__TEMP__');

export const generateYamlList = (value: string): YamlItemType[] => {
  try {
    return [
      {
        filename: 'Deploy',
        value: value
      }
    ];
  } catch (error) {
    return [];
  }
};

export const parseTemplateString = (
  sourceString: string,
  regex: RegExp = /\$\{\{\s*(.*?)\s*\}\}/g,
  dataSource: any
) => {
  const replacedString = sourceString.replace(regex, (match: string, key: string) => {
    if (dataSource[key] && key.indexOf('.') === -1) {
      return dataSource[key];
    }
    if (key.indexOf('.') !== -1) {
      const value = key.split('.').reduce((obj: any, prop: string) => obj[prop], dataSource);
      return value !== undefined ? value : match;
    }
  });
  return replacedString;
};

export const handerDefaultValues = () => {};

export const getTemplateDataSource = (template: TemplateType) => {
  if (!template) return;
  const { defaults, inputs } = template.spec;
  // support function list
  const functionHandlers = {
    random: (value: string) => {
      const length = value.match(/\${{ random\((\d+)\) }}/)?.[1];
      const randomValue = nanoid(Number(length));
      return value.replace(/\${{ random\(\d+\) }}/, randomValue);
    }
  };
  // handle default value
  const cloneDefauls = cloneDeep(defaults);
  Object.entries(cloneDefauls).forEach(([key, item]) => {
    Object.entries(functionHandlers).forEach(([handlerKey, handler]) => {
      if (item.value && item.value.includes(`\${{ ${handlerKey}(`)) {
        item.value = handler(item.value);
      }
    });
  });
  // handle input value
  const transformedInput = Object.entries(inputs).map(([key, value]) => ({
    description: value.description,
    type: value.type,
    default: value.default,
    required: value.required,
    key: key,
    label: key.replace('_', ' ')
  }));
  const dataSource = {
    defaults: cloneDefauls,
    inputs: transformedInput
  };

  return dataSource;
};
