import { AnyObject } from "./types/index.d";

export const csl = (data: AnyObject | unknown): void => {
  console.log(
    "%c以下是记录的性能信息...",
    "color:red;font-size:18px;font-style:oblique;"
  );
  console.log(data);
};

export default {};
