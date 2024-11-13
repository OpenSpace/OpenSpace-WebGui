import { useEffect, useState } from 'react';

import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import {
  loadExoplanetsData,
  removeExoplanets
} from '@/redux/exoplanets/exoplanetsMiddleware';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { NavigationAimKey, NavigationAnchorKey } from '@/util/keys';
import { propertyDispatcher } from '@/util/propertyDispatcher';

const UNCERTAINTY_DISC_TAG = 'exoplanet_uncertainty_disc';
const UNCERTAINTY_DISC_PROPERTY = 'Modules.Exoplanets.ShowOrbitUncertainty';
const HABITABLE_ZONE_TAG = 'exoplanet_habitable_zone';
const HABITABLE_ZONE_PROPERTY = 'Modules.Exoplanets.ShowHabitableZone';
const SIZE_1AU_RING_TAG = 'exoplanet_1au_ring';
const SIZE_1AU_RING_PROPERTY = 'Modules.Exoplanets.ShowComparisonCircle';

export function ExoplanetsPanel() {
  const [starName, setStarName] = useState('');
  const [isSettingsExpanded, setSettingsExpanded] = useState(false);

  const luaApi = useAppSelector((state) => state.luaApi);
  const propertyOwners = useAppSelector((state) => {
    return state.propertyTree.owners.propertyOwners;
  });

  const isDataInitialized = useAppSelector((state) => state.exoplanets.isInitialized);
  const systemList = useAppSelector((state) => state.exoplanets.data);

  const aim = useAppSelector((state) => {
    const aimProp = state.propertyTree.props.properties[NavigationAimKey];
    return aimProp && aimProp.value;
  }) as string | undefined;

  const anchor = useAppSelector((state) => {
    const anchorProp = state.propertyTree.props.properties[NavigationAnchorKey];
    return anchorProp && anchorProp.value;
  }) as string | undefined;

  const showHabitableZone = useAppSelector(
    (state) => state.propertyTree.props.properties[HABITABLE_ZONE_PROPERTY]?.value
  );

  const showOrbitUncertainty = useAppSelector(
    (state) => state.propertyTree.props.properties[UNCERTAINTY_DISC_PROPERTY]?.value
  );

  const show1AuRing = useAppSelector(
    (state) => state.propertyTree.props.properties[SIZE_1AU_RING_PROPERTY]?.value
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isDataInitialized) {
      dispatch(loadExoplanetsData());
    }
  }, []);

  useEffect(() => {
    showHabitableZoneDispatcher.subscribe();
    showOrbitUncertaintyDispatcher.subscribe();
    show1AuRingDispatcher.subscribe();
    return () => {
      showHabitableZoneDispatcher.unsubscribe();
      showOrbitUncertaintyDispatcher.unsubscribe();
      show1AuRingDispatcher.unsubscribe();
    };
  }, []);

  if (!propertyOwners || Object.values(propertyOwners).includes(undefined)) {
    return <p>No active systems</p>;
  }
  // Find already existing exoplent systems among the property owners
  const systems = Object.values(propertyOwners).filter((owner) =>
    owner!.tags.includes('exoplanet_system')
  );
  const exoplanetSystemsUris = systems.map(
    (owner) => owner && `Scene.${owner.identifier}`
  );
  const hasSystems = systemList && systemList.length > 0;

  const showHabitableZoneDispatcher = propertyDispatcher(
    dispatch,
    HABITABLE_ZONE_PROPERTY
  );
  const showOrbitUncertaintyDispatcher = propertyDispatcher(
    dispatch,
    UNCERTAINTY_DISC_PROPERTY
  );
  const show1AuRingDispatcher = propertyDispatcher(dispatch, SIZE_1AU_RING_PROPERTY);

  function toggleShowHabitableZone() {
    const shouldShow = !showHabitableZone;
    showHabitableZoneDispatcher.set(shouldShow);
    // Also disable all previously enabled exoplanet habitable zones
    if (exoplanetSystemsUris?.length > 0) {
      luaApi?.setPropertyValueSingle(
        `{${HABITABLE_ZONE_TAG}}.Renderable.Enabled`,
        shouldShow
      );
    }
  }

  function toggleShowOrbitUncertainty() {
    const shouldShow = !showOrbitUncertainty;
    showOrbitUncertaintyDispatcher.set(shouldShow);
    // Also disable all previously enabled exoplanet orbit uncertainty discs
    if (exoplanetSystemsUris?.length > 0) {
      luaApi?.setPropertyValueSingle(
        `{${UNCERTAINTY_DISC_TAG}}.Renderable.Enabled`,
        shouldShow
      );
    }
  }

  function toggleShow1AuRing() {
    const shouldShow = !show1AuRing;
    show1AuRingDispatcher.set(shouldShow);
    // Also disable all previously enabled exoplanet orbit uncertainty discs
    if (exoplanetSystemsUris?.length > 0) {
      luaApi?.setPropertyValueSingle(
        `{${SIZE_1AU_RING_TAG}}.Renderable.Enabled`,
        shouldShow
      );
    }
  }

  function removeExoplanetSystem(systemName: string) {
    const matchingAnchor = anchor?.indexOf(systemName) === 0;
    const matchingAim = aim?.indexOf(systemName) === 0;
    if (matchingAnchor || matchingAim) {
      propertyDispatcher(dispatch, NavigationAnchorKey).set('Sun');
      propertyDispatcher(dispatch, NavigationAimKey).set('');
    }

    dispatch(removeExoplanets({ system: systemName }));
  }

  function addSystem() {
    luaApi?.exoplanets.addExoplanetSystem(starName);
  }

  const noContentLabel = <p>No active systems</p>;
  let panelContent;

  if (exoplanetSystemsUris.length === 0) {
    panelContent = noContentLabel;
  } else {
    panelContent = exoplanetSystemsUris.map((prop) => (
      <PropertyOwner
        key={prop}
        uri={prop}
        trashAction={removeExoplanetSystem}
        expansionIdentifier={`P:${prop}`}
      />
    ));
  }
  return <></>;
  //(
  // <div className={Popover.styles.content}>
  //   <Row>
  //     {hasSystems ? (
  //       <FilterList className={styles.list} searchText="Star name...">
  //         <FilterListData>
  //           {systemList.map((system) => (
  //             <FocusEntry
  //               key={system.name}
  //               onSelect={setStarName}
  //               active={starName}
  //               {...system}
  //             />
  //           ))}
  //         </FilterListData>
  //       </FilterList>
  //     ) : (
  //       <CenteredLabel className={styles.redText}>
  //         No exoplanet data was loaded
  //       </CenteredLabel>
  //     )}
  //     <div className={Popover.styles.row}>
  //       <Button
  //         onClick={addSystem}
  //         title="Add system"
  //         style={{ width: 90 }}
  //         disabled={!starName}
  //       >
  //         <MdPublic alt="add_system" />
  //         <span style={{ marginLeft: 5 }}>Add System</span>
  //       </Button>
  //     </div>
  //   </Row>
  // </div>
  // <HorizontalDelimiter />
  // <ToggleContent
  //   title="Settings"
  //   expanded={isSettingsExpanded}
  //   setExpanded={setSettingsExpanded}
  // >
  //   <Checkbox
  //     checked={showHabitableZone}
  //     name="showHabitableZone"
  //     setChecked={toggleShowHabitableZone}
  //   >
  //     <span className={styles.checkboxLabel}>Show Habitable Zones</span>
  //     <InfoBox
  //       className={styles.infoBox}
  //       text={`Show/Hide the habitable zone visualizations. Setting the value
  //       automatically updates the visibility for all added exoplanet systems`}
  //     />
  //   </Checkbox>
  //   <Checkbox
  //     checked={showOrbitUncertainty}
  //     name="showOrbitUncertainty"
  //     setChecked={toggleShowOrbitUncertainty}
  //   >
  //     <span className={styles.checkboxLabel}>Show Orbit Uncertainty</span>
  //     <InfoBox
  //       className={styles.infoBox}
  //       text={`Show/Hide disc visualization of the uncertainty of the planetary
  //       orbits. Setting the value automatically updates the visibility for all
  //       added exoplanet systems`}
  //     />
  //   </Checkbox>
  //   <Checkbox checked={show1AuRing} name="show1AuRing" setChecked={toggleShow1AuRing}>
  //     <span className={styles.checkboxLabel}>Show 1 AU Size Ring</span>
  //     <InfoBox
  //       className={styles.infoBox}
  //       text={`If true, show a ring with the radius 1 AU around the host star of
  //       each system, to use for size comparison. Setting the value automatically
  //       updates the visibility for all added exoplanet systems`}
  //     />
  //   </Checkbox>
  // </ToggleContent>
  // <HorizontalDelimiter />
  // <div className={Popover.styles.title}>Added Systems </div>
  // <div className={styles.slideList}>
  //   <ScrollOverlay>{panelContent}</ScrollOverlay>
  // </div>
  // );
}
