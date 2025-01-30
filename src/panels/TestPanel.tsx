import { useTranslation } from 'react-i18next';

export function TestPanel() {
  const { t } = useTranslation();
  const { t: withCustomNamespace } = useTranslation('otherNamespace');

  return (
    <>
      <div>{t('mytest')}</div>
      <div>{t('deep.foo')}</div>
      <div>{withCustomNamespace('bar')}</div>
      {/*We can also access it using the ns as an option */}
      <div>{t('baz', { ns: 'otherNamespace' })}</div>
      <div>{t('dynamic_values', { firstName: 'Andreas', lastName: 'Engberg' })}</div>
      <div>{t('test_plurals', { count: 0 })}</div>
      <div>{t('test_plurals', { count: 1 })}</div>
      <div>{t('test_plurals', { count: 12 })}</div>
    </>
  );
}
