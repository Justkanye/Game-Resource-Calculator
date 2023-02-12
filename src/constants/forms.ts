import * as yup from "yup";
import { formatParentname } from "../helpers";

import { AddGameInitialValues } from "../types";

yup.addMethod(
  yup.array,
  "unique",
  function (fieldName = "name", parentName = "Resources") {
    return this.test(
      "unique",
      `${parentName} ${fieldName} must be unique`,
      function (values) {
        let hasErr = false;
        let index = 0;
        values?.forEach((val, i) => {
          if (
            values.filter(
              _val =>
                (typeof _val[fieldName] === "string"
                  ? _val[fieldName].trim().toLowerCase()
                  : _val[fieldName]) ===
                (typeof val[fieldName] === "string"
                  ? val[fieldName].trim().toLowerCase()
                  : val[fieldName])
            ).length > 1
          ) {
            hasErr = true;
            index = i;
            return this.createError({
              path: `${parentName?.toLowerCase()}[${i}][${fieldName}]`,
              message: `${formatParentname(
                parentName
              )} ${fieldName} must be unique`,
            });
          }
        });

        if (hasErr) {
          return this.createError({
            path: `${this.path}[${index}][${fieldName}]`,
            message: `${formatParentname(
              parentName
            )} ${fieldName} must be unique`,
          });
        } else {
          return true;
        }
      }
    );
  }
);

export const addGameInitialValues: AddGameInitialValues = {
  name: "",
  resources: [],
};
export const addGameValidationSchema = yup.object({
  name: yup.string().required().label("Game name").min(3),
  resources: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required().label("Resource name").min(3),
        packs: yup
          .array()
          .label("Resource pack")
          .of(
            yup.object().shape({
              name: yup.string().required().label("Resource pack name").min(3),
              value: yup.number().min(1).label("Resource pack value"),
            })
          )
          // @ts-ignore
          .unique("name", "Resource pack"),
      })
    )
    // @ts-ignore
    .unique(),
});
export const gameSchema = yup.object({
  name: yup.string().required().label("Game name").min(3),
  resources: yup
    .array()
    //@ts-ignore
    .unique()
    .of(
      yup.object().shape({
        name: yup.string().required().label("Resource name").min(3),
        packs: yup
          .array()
          .label("Resource pack")
          .of(
            yup.object().shape({
              name: yup.string().required().label("Resource pack name").min(3),
              value: yup.number().min(1).label("Resource pack value"),
              quantity: yup.number().label("Resource pack quantity"),
            })
          ),
      })
    ),
  id: yup.string().required().trim(),
});
