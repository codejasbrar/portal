import React from "react";

//Styles
import styles from "./Biomarkers.module.scss";
import Input from "../../Input/Input";

type SearchBiomarkersPropsTypes = {};

const SearchBiomarkers = (props: SearchBiomarkersPropsTypes) => {

  return <Input name={'search'} label={''} placeholder={'Search biomarker or test panel'} />
};

export default SearchBiomarkers;