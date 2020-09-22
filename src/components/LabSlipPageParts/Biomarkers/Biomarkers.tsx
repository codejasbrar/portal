import React, {useEffect, useState} from "react";

//Styles
import styles from "./Biomarkers.module.scss";

import LabSlipApiService from "../../../services/LabSlipApiService";
import Input from "../../Input/Input";
import {ReactComponent as SearchIcon} from "../../../icons/search.svg";
import PanelsList from "./PanelsList";
import {Panel} from "../../../interfaces/Test";
import {on} from "cluster";

type BiomarkersPropsTypes = {
  onSetLoading: (state: boolean) => void,
  onChangePanelsArray: (panels: number[]) => void,
  onChangeBiomarkersArray: (markers: string[]) => void,
  selectedPanels: number[] | undefined;
};

const Biomarkers = (props: BiomarkersPropsTypes) => {
  const [labPanels, setLabPanels] = useState([] as Panel[]);
  const [planPanels, setPlanPanels] = useState([] as Panel[]);
  const [selectedCodesArray, setSelectedCodes] = useState([] as number[]);
  const [searchText, setSearchText] = useState('');
  const {onSetLoading, onChangePanelsArray, selectedPanels, onChangeBiomarkersArray} = props;

  useEffect(() => {
    onChangePanelsArray(selectedCodesArray);
    onChangeBiomarkersArray(mapSelectedPanelsToBiomarkersArray());
  }, [selectedCodesArray]);

  const mapSelectedPanelsToBiomarkersArray = () => {
    const selectedBiomarkers = [] as string[];
    labPanels.filter(panel => selectedCodesArray?.includes(panel.code)).forEach(panel => {
      if (panel.biomarkers) panel.biomarkers.forEach(marker => {
        selectedBiomarkers.push(marker.abbr)
      })
    })
    return selectedBiomarkers;
  };

  useEffect(() => {
    if(!selectedPanels) setSelectedCodes([]);
  }, [selectedPanels])

  useEffect(() => {
    (async () => {
      onSetLoading(true);
      await LabSlipApiService.getPanels().then((responses) => {
        setPlanPanels(responses[0].data);
        setLabPanels(responses[1].data);
        onSetLoading(false);
      })
    })();
  }, []);

  const compareSelectedPanels = () => labPanels.filter(panel => selectedCodesArray.includes(panel.code));

  return <section className={styles.container}>
    <div className={styles.Biomarkers}>
      <div className={styles.BiomarkersSearchWrapper}>
        {/*<h3 className={`${styles.heading20} ${styles.BiomarkersSearchTitle}`}>Search test panels</h3>*/}
        <Input classes={{root: styles.BiomarkersSearchInput}}
          name={'search'}
          placeholder={'Search panels'}
          clear
          onChange={setSearchText}
          value={searchText}
          icon={<SearchIcon />} />
        <PanelsList selected={selectedCodesArray}
          setSelected={setSelectedCodes}
          mode='lab'
          panels={labPanels.filter(panel => panel.name.toLowerCase().includes(searchText.toLowerCase()))} />
        <PanelsList selected={selectedCodesArray}
          setSelected={setSelectedCodes}
          mode='plan'
          panels={planPanels.filter(panel => panel.name.toLowerCase().includes(searchText.toLowerCase()))} />
      </div>
      <div className={styles.BiomarkersSelectedWrapper}>
        <h3 className={styles.heading20}>Lab panels added to lab slip</h3>
        <div className={styles.BiomarkersSelectedList}>
          {compareSelectedPanels().length ? <PanelsList selected={selectedCodesArray}
              setSelected={setSelectedCodes}
              panels={compareSelectedPanels()}
              mode={'all'} /> :
            'No panels added'}
        </div>
      </div>
    </div>
  </section>
};

export default Biomarkers;