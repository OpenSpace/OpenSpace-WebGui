import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useThrottledCallback } from '@mantine/hooks';
import { modals } from '@mantine/modals';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  subscribeToProperty,
  unsubscribeToProperty
} from '@/redux/propertytree/properties/propertiesMiddleware';
import { setPropertyValue } from '@/redux/propertytree/properties/propertiesSlice';
import { PropertyOrPropertyGroup, PropertyTypeKey } from '@/types/Property/property';
import { PropertyGroupsRuntime } from '@/types/Property/propertyGroups';
import { Uri } from '@/types/types';

function validatePropertyType<T>(
  type: T,
  prop: PropertyOrPropertyGroup<T> | undefined
): boolean {
  // Collect all the valid types - groups and specific property types
  const allowedTypes: string[] =
    typeof type === 'string' && type in PropertyGroupsRuntime
      ? Array.from(PropertyGroupsRuntime[type as keyof typeof PropertyGroupsRuntime])
      : [type as string];

  // Check if that is the case
  if (prop !== undefined && !allowedTypes.includes(prop.metaData.type)) {
    return false;
  }
  return true;
}

export function useProperty<T extends PropertyTypeKey>(
  type: T,
  uri: Uri
): [
  PropertyOrPropertyGroup<T>['value'] | undefined,
  (value: PropertyOrPropertyGroup<T>['value']) => void,
  PropertyOrPropertyGroup<T>['metaData'] | undefined
] {
  const { t } = useTranslation('components', {
    keyPrefix: 'property'
  });
  // Get the value from Redux
  const prop = useAppSelector((state) => state.properties.properties[uri]) as
    | PropertyOrPropertyGroup<T>
    | undefined;

  if (!validatePropertyType(type, prop)) {
    throw new Error(
      `Tried to access property with uri "${uri}" as type "${type}", but it is of type "${prop?.metaData.type}"`
    );
  }

  const shouldShowModal = useShouldShowModal(prop?.metaData);
  useSubscribeToProperty(uri);
  const dispatch = useAppDispatch();
  // Subscribe to the property
  const ThrottleMs = 1000 / 60;

  const setValue = useThrottledCallback((value: PropertyOrPropertyGroup<T>['value']) => {
    if (shouldShowModal) {
      modals.openConfirmModal({
        title: t('confirmation-modal.title'),
        children: t('confirmation-modal.description', {
          propertyName: prop?.metaData.guiName
        }),
        labels: {
          confirm: t('confirmation-modal.confirm'),
          cancel: t('confirmation-modal.cancel')
        },
        confirmProps: { color: 'red', variant: 'filled' },
        onConfirm: () => dispatch(setPropertyValue({ uri, value }))
      });
    } else {
      dispatch(setPropertyValue({ uri, value }));
    }
  }, ThrottleMs);

  return [prop?.value, setValue, prop?.metaData];
}

export function useSubscribeToProperty(uri: Uri) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(subscribeToProperty({ uri }));
    return () => {
      dispatch(unsubscribeToProperty({ uri }));
    };
  }, [dispatch, uri]);
}

function useShouldShowModal<T extends PropertyTypeKey>(
  metaData: PropertyOrPropertyGroup<T>['metaData'] | undefined
): boolean {
  const showConfirmationModal = useAppSelector(
    (state) => state.properties.properties['OpenSpaceEngine.ShowPropertyConfirmation']
  )?.value as boolean | undefined;

  useSubscribeToProperty('OpenSpaceEngine.ShowPropertyConfirmation');

  // Don't show modal if we can't find the global settings or the metadata
  if (showConfirmationModal === undefined || metaData === undefined) {
    return false;
  }

  return metaData.needsConfirmation && showConfirmationModal;
}
