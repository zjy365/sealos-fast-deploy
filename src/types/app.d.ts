export type TemplateType = {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
  };
  spec: {
    github: string;
    author: string;
    title: string;
    url: string;
    readme: string;
    icon: string;
    description: string;
    template_type: 'inline';
    defaults: Record<
      string,
      {
        type: 'string';
        value: string;
      }
    >;
    inputs: Record<
      string,
      {
        description: string;
        type: 'string';
        default: string;
        required: boolean;
      }
    >;
  };
};

export type TemplateSource = {
  source: {
    defaults: Record<
      string,
      {
        type: 'string';
        value: string;
      }
    >;
    inputs: Record<
      string,
      {
        description: string;
        type: 'string';
        default: string;
        required: boolean;
      }
    >;
    appName: string;
    SEALOS_NAMESPACE: string;
  };
  yamlList: any[];
};
