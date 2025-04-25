import { create } from "docusaurus-plugin-openapi-docs/lib/markdown/utils";
import { ApiItem } from "docusaurus-plugin-openapi-docs/lib/types";

interface Props {
  parameters: ApiItem["parameters"];
}

export function createParamsDetails({ parameters }: Props) {
  if (!parameters || parameters.length === 0) {
    return [];
  }

  // Enhance parameters by adding an explicit 'example' field
  const enhancedParameters = parameters.map((param) => ({
    ...param,
    example: param.schema?.example !== undefined ? param.schema.example : null,
  }));

  // Default ParamsDetails component with enhanced parameters
  const paramsDetails = create("ParamsDetails", {
    parameters: enhancedParameters,
  });

  return [paramsDetails, "\n\n"];
}
