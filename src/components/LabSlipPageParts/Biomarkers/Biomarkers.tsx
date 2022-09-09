import React, {useEffect, useMemo, useState} from "react";

//Styles
import styles from "./Biomarkers.module.scss";

import LabSlipApiService from "../../../services/LabSlipApiService";
import Input from "../../Input/Input";
import {ReactComponent as SearchIcon} from "../../../icons/search.svg";
import PanelsList from "./PanelsList";
import {LabPanel, LabWithPlanPanels, PlanPanel} from "../../../interfaces/Test";
import {LabSlipInfo} from "../../../pages/Labslip/LabSlipPage";

type BiomarkersPropsTypes = {
  onSetLoading: (state: boolean) => void,
  onChangePanelsIdsArray: (panelsIds: string[]) => void,
  onChangeLabPanelsArray: (panels: PlanPanel[]) => void,
  selectedPanels: string[] | undefined,
  preSelectedPanel: string;
  labSlipInfo: LabSlipInfo;
};

const Biomarkers = (props: BiomarkersPropsTypes) => {
  const [labPanels, setLabPanels] = useState([] as LabPanel[]);
  const [labsWithPlanPanels, setLabsWithPlanPanels] = useState([] as LabWithPlanPanels[]);
  const [selectedCodesArray, setSelectedCodes] = useState([] as string[]);
  const [searchText, setSearchText] = useState('');
  const {
    onSetLoading,
    onChangePanelsIdsArray,
    selectedPanels,
    onChangeLabPanelsArray,
    preSelectedPanel,
    labSlipInfo
  } = props;

  const filteredLabPanels = useMemo(() => {
    return labSlipInfo.laboratory ?
      labPanels.filter(panel => panel.laboratoryId === labSlipInfo.laboratory || panel.laboratoryId === null) :
      []
  }, [labPanels, labSlipInfo.laboratory]);

  const planPanels = labsWithPlanPanels.find(lab => lab.id === labSlipInfo.laboratory)?.planPanels || [] as PlanPanel[];

  useEffect(() => {
    onChangePanelsIdsArray(selectedCodesArray);
    onChangeLabPanelsArray(filteredLabPanels.filter(panel => selectedCodesArray.includes(panel.code)));
  }, [selectedCodesArray, filteredLabPanels, onChangeLabPanelsArray, onChangePanelsIdsArray, labSlipInfo.laboratory]);

  useEffect(() => {
    if (!selectedPanels) setSelectedCodes([]);
  }, [selectedPanels]);

  useEffect(() => {
    const panel = planPanels.find(panel => panel.name === preSelectedPanel);
    if (panel && panel.labPanels) {
      setSelectedCodes([panel.code, ...panel.labPanels.map(panel => panel.code)])
    } else {
      setSelectedCodes([]);
    }
  }, [preSelectedPanel, labsWithPlanPanels, labSlipInfo.laboratory]);

  useEffect(() => {
    onSetLoading(true);
    Promise.all([
      LabSlipApiService.getPlanPanels(),
      LabSlipApiService.getLabPanels(),
    ]).then(res => {
      setLabsWithPlanPanels(res[0]);
      setLabPanels(res[1]);
    }).finally(() => onSetLoading(false));
  }, [onSetLoading]);

  const compareSelectedPanels = () => filteredLabPanels.filter(panel => selectedCodesArray.includes(panel.code));

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
          panels={filteredLabPanels.filter(panel => panel.name.toLowerCase().includes(searchText.toLowerCase()))} />
        <PanelsList selected={selectedCodesArray}
          setSelected={setSelectedCodes}
          mode='plan'
          panels={planPanels.filter(panel => panel.prettyName && panel.prettyName.toLowerCase().includes(searchText.toLowerCase()))} />
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
