import React, { useEffect } from "react";

import { ErrorMessage } from "@hookform/error-message";
import FormSelect from "@theme/ApiExplorer/FormSelect";
import { Param, setParam } from "@theme/ApiExplorer/ParamOptions/slice";
import { useTypedDispatch } from "@theme/ApiItem/hooks";
import { Controller, useFormContext } from "react-hook-form";

export interface ParamProps {
  param: Param;
}

export default function ParamSelectFormItem({ param }: ParamProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const showErrorMessage = errors?.paramSelect;

  const dispatch = useTypedDispatch();

  const options = param.schema?.enum ?? [];

  // Set the example value as the default when component mounts
  useEffect(() => {
    if (
      param.value === undefined &&
      param.schema?.example &&
      options.includes(param.schema.example)
    ) {
      dispatch(
        setParam({
          ...param,
          value: String(param.schema.example),
        })
      );
    }
  }, [param, dispatch, options]);

  return (
    <>
      <Controller
        control={control}
        rules={{ required: param.required ? "This field is required" : false }}
        name="paramSelect"
        defaultValue={param.value || param.schema?.example || "---"}
        render={({ field }) => (
          <FormSelect
            options={["---", ...(options as string[])]}
            value={field.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value;
              field.onChange(val); // Let RHF handle it
              dispatch(
                setParam({
                  ...param,
                  value: val === "---" ? undefined : val,
                })
              );
            }}
          />
        )}
      />
      {showErrorMessage && (
        <ErrorMessage
          errors={errors}
          name="paramSelect"
          render={({ message }) => (
            <div className="openapi-explorer__input-error">{message}</div>
          )}
        />
      )}
    </>
  );
}
