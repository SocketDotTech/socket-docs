import React, { useEffect } from "react";
import FormTextInput from "@theme/ApiExplorer/FormTextInput";
import { Param, setParam } from "@theme/ApiExplorer/ParamOptions/slice";
import { useTypedDispatch } from "@theme/ApiItem/hooks";
import { Controller, useFormContext } from "react-hook-form";

export interface ParamProps {
  param: Param;
}

export default function ParamTextFormItem({ param }: ParamProps) {
  const dispatch = useTypedDispatch();
  const { control, setValue } = useFormContext();

  useEffect(() => {
    if (param.schema?.example !== undefined) {
      const val =
        param.in === "path" || param.in === "query"
          ? String(param.schema.example).replace(/\s/g, "%20")
          : String(param.schema.example);
      setValue(param.name, val); // only set once
    }
  }, [param.name, param.schema?.example, setValue]);

  return (
    <Controller
      control={control}
      name={param.name}
      defaultValue=""
      render={({ field }) => (
        <FormTextInput
          isRequired={param.required}
          paramName={param.name}
          placeholder={param.description || param.name}
          value={field.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const val =
              param.in === "path" || param.in === "query"
                ? e.target.value.replace(/\s/g, "%20")
                : e.target.value;
            field.onChange(val);
            dispatch(setParam({ ...param, value: val }));
          }}
        />
      )}
    />
  );
}
