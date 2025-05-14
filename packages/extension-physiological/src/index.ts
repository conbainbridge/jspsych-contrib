import { JsPsych, JsPsychExtension, JsPsychExtensionInfo, ParameterType } from "jspsych";

//import { version } from "../package.json";

interface InitializeParameters {}

interface OnStartParameters {}

interface OnLoadParameters {}

interface OnFinishParameters {}

/**
 * **extension-physiological**
 *
 * An extension for integrating a physiological device, such as a FitBit.
 *
 * @author Constance Bainbridge and Natasha Chaku
 * @see {@link /extension-physiological/README.md}}
 */
class PhysiologicalExtension implements JsPsychExtension {
  static info: JsPsychExtensionInfo = {
    name: "extension-physiological",
    //version: version,
    data: {
      /** Provide a clear description of the data1 that could be used as documentation. We will eventually use these comments to automatically build documentation and produce metadata. */
      data1: {
        type: ParameterType.INT,
      },
      /** Provide a clear description of the data2 that could be used as documentation. We will eventually use these comments to automatically build documentation and produce metadata. */
      data2: {
        type: ParameterType.STRING,
      },
    },
    // When you run build on your extension, citations will be generated here based on the information in the CITATION.cff file.
    citations: "__CITATIONS__",
  };

  constructor(private jsPsych: JsPsych) {}

  initialize = ({}: InitializeParameters): Promise<void> => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

  on_start = (): void => {
    return;
  };

  on_load = (): void => {};

  on_finish = (): { [key: string]: any } => {
    var hr;

    // fetch(
    //   "https://api.fitbit.com/1/user/-/activities/heart/date/2025-05-13/2025-05-13/1sec/time/08:00/08:30.json",
    //   {
    //     method: "GET",
    //     headers: {
    //       Accept: "application/json",
    //       Authorization:
    //         "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1FITlgiLCJzdWIiOiJDTFo4WFQiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJlY2cgcnNldCByaXJuIHJveHkgcm51dCBycHJvIHJzbGUgcmNmIHJhY3QgcnJlcyBybG9jIHJ3ZWkgcmhyIHJ0ZW0iLCJleHAiOjE3NDcyNjQyODAsImlhdCI6MTc0NzIzNTQ4MH0.WT1nWy5MPFDpqhn-rEdODkHKCuzJNR2KIbt4hMlEUTs",
    //     },
    //   }
    // )
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log("Heart Rate Data:", data);
    //     hr = data;
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching heart rate data:", error);
    //   });

    fetch("http://localhost:3000/fitbit-profile")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fitbit data:", data);
        // You can now use the Fitbit data inside your jsPsych timeline
      })
      .catch((error) => {
        console.error("Error fetching Fitbit data:", error);
      });

    return {
      data1: 99, // Make sure this type and name matches the information for data1 in the data object contained within the info const.
      data2: "hello world!", // Make sure this type and name matches the information for data2 in the data object contained within the info const.
      heartrate: hr,
    };
  };
}

export default PhysiologicalExtension;
