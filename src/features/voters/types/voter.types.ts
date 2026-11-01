export interface VoterSurvey {
  survey_id: number;
  email: string;
  mobile_2: string;
  color_code: string;
  new_address: string;
  cast: string;
  personnel: string;
  position: string;
  society: string;
  date_of_birth: string;
  demands: string;
  dead: number;
  is_voted: number;
  star_voter: number;
}

export interface VoterExtraInfo {
  extra_info_1: string;
  extra_info_2: string;
  extra_info_3: string;
  extra_info_4: string;
  extra_info_5: string;
  extra_check_1: string;
  extra_check_2: string;
}

export interface VoterMember {
  id: string;
  name: string;
  father_name: string;
  relation: string;
  address: string;
  booth: string;
  srn: string;
  gender: string;
  age: string;
  voter_id: string;
  type: string;
}

export interface Voter {
  id: number;
  name: string;
  father_name: string;
  relation: string;
  gender: string;
  age: number;
  dob: string;
  cast: string;
  voter_id: string;
  acc_no: string;
  part_no: string;
  srn: string;
  village: string;
  address: string;
  house_no: string;
  booth: string;
  mobile_1: string;
  image: string;
  survey?: VoterSurvey | null;
  extra_information?: VoterExtraInfo | null;
  members?: VoterMember[];
}

export interface GetAllVotersResponse {
  status: number;
  message: string;
  language: string;
  count: number;
  voters: Voter[];
}

export type SearchVotersResponse = GetAllVotersResponse;

