import React, { useEffect } from "react";

import { ErrorMessage } from "@hookform/error-message";
import FormSelect from "@theme/ApiExplorer/FormSelect";
import { Param, setParam } from "@theme/ApiExplorer/ParamOptions/slice";
import { useTypedDispatch } from "@theme/ApiItem/hooks";
import { Controller, useFormContext } from "react-hook-form";

export interface ParamProps {
  param: Param;
}

export default function ParamBooleanFormItem({ param }: ParamProps) {
  const dispatch = useTypedDispatch();

  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();

  const showErrorMessage = errors?.paramBoolean;

  // Set the example value only once
  useEffect(() => {
    if (param.schema?.example !== undefined) {
      setValue("paramBoolean", String(param.schema.example));
    }
  }, [param.schema?.example, setValue]);

  return (
    <>
      <Controller
        control={control}
        name="paramBoolean"
        defaultValue={param.schema?.example !== undefined ? String(param.schema.example) : "---"}
        render={({ field }) => (
          <FormSelect
            name={field.name}
            options={["---", "true", "false"]}
            value={field.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value;
              field.onChange(val);
              dispatch(setParam({ ...param, value: val === "---" ? undefined : val }));
            }}
          />
        )}
      />
      {showErrorMessage && (
        <ErrorMessage
          errors={errors}
          name="paramBoolean"
          render={({ message }) => (
            <div className="openapi-explorer__input-error">{message}</div>
          )}
        />
      )}
    </>
  );
}
