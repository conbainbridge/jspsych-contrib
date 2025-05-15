import { JsPsych, JsPsychExtension, JsPsychExtensionInfo, ParameterType } from "jspsych";

interface InitializeParameters {}

interface OnStartParameters {}

interface OnLoadParameters {}

interface OnFinishParameters {}

/**
 * **extension-physiological**
 *
 * An extension for integrating a physiological device, such as a FitBit.
 */
class PhysiologicalExtension implements JsPsychExtension {
  static info: JsPsychExtensionInfo = {
    name: "extension-physiological",
    data: {
      data1: { type: ParameterType.INT },
      data2: { type: ParameterType.STRING },
    },
    citations: "__CITATIONS__",
  };

  constructor(private jsPsych: JsPsych) {}

  private trialStartTime: Date | null = null;

  initialize = ({}: InitializeParameters): Promise<void> => {
    return Promise.resolve();
  };

  on_start = (): void => {
    this.trialStartTime = new Date();
  };

  on_load = (): void => {};

  on_finish = (): Promise<{ [key: string]: any }> => {
    const trialIndex = this.jsPsych.getProgress().current_trial_global;
    const trialEndTime = new Date();
    const onset = this.trialStartTime?.toISOString() ?? "";
    const offset = trialEndTime.toISOString();

    const pad = (n: number) => n.toString().padStart(2, "0");
    const formatTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    const startTime = formatTime(this.trialStartTime ?? new Date(trialEndTime.getTime() - 5 * 60000));
    const endTime = formatTime(trialEndTime);
    const date = formatDate(trialEndTime);

    const profileUrl = "http://localhost:3000/fitbit-profile";
    const heartUrl = `http://localhost:3000/fitbit-heart?date=${date}&startTime=${startTime}&endTime=${endTime}`;

    return Promise.all([
      fetch(profileUrl).then((res) => res.json()),
      fetch(heartUrl).then((res) => res.json())
    ])
      .then(([profileData, heartRateData]) => {
        return {
          trial_index: trialIndex,
          onset,
          offset,
          data1: 99,
          data2: "hello world!",
          profile: profileData,
          heartrate: heartRateData,
          heart_rate_window: { startTime, endTime, date }
        };
      })
      .catch((error: any) => {
        console.error("Error fetching Fitbit data:", error);
        return {
          trial_index: trialIndex,
          onset,
          offset,
          data1: 99,
          data2: "hello world!",
          error: error.message
        };
      });
  };
}

export default PhysiologicalExtension;
