import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Save } from 'lucide-react';
import { adsSettingsApi } from '../services/api';
import PageSkeleton from '../components/PageSkeleton';

interface AdsSettings {
  _id: string;
  allAdsEnabled: boolean;
  bannerAdsEnabled: boolean;
  nativeAdsEnabled: boolean;
  interstitialAdsEnabled: boolean;
  interracialAdsEnabled: boolean;
  interstitialAdsShowCounter: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  rewardedAdsEnabled: boolean;
  appOpenAdsEnabled: boolean;
  bannerAdsId?: string;
  nativeAdsId?: string;
  interstitialAdsId?: string;
  interracialAdsId?: string;
  rewardedAdsId?: string;
  appOpenAdsId?: string;
  createdAt: string;
  updatedAt: string;
}

type AdsSettingsForm = Omit<AdsSettings, '_id' | 'createdAt' | 'updatedAt'>;

const emptyIdFields = {
  bannerAdsId: '',
  nativeAdsId: '',
  interstitialAdsId: '',
  interracialAdsId: '',
  rewardedAdsId: '',
  appOpenAdsId: '',
};

const mapIdsFromApi = (s: AdsSettings | Record<string, unknown>) => ({
  bannerAdsId: (s.bannerAdsId as string | undefined) ?? '',
  nativeAdsId: (s.nativeAdsId as string | undefined) ?? '',
  interstitialAdsId: (s.interstitialAdsId as string | undefined) ?? '',
  interracialAdsId: (s.interracialAdsId as string | undefined) ?? '',
  rewardedAdsId: (s.rewardedAdsId as string | undefined) ?? '',
  appOpenAdsId: (s.appOpenAdsId as string | undefined) ?? '',
});

const INTERSTITIAL_COUNTER_RANGE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

function normalizeInterstitialCounter(
  value: unknown
): AdsSettings['interstitialAdsShowCounter'] {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return 3;
  const clamped = Math.min(10, Math.max(1, Math.round(n)));
  return clamped as AdsSettings['interstitialAdsShowCounter'];
}

const AdsSettings = () => {
  const [settings, setSettings] = useState<AdsSettings | null>(null);
  const [formData, setFormData] = useState<AdsSettingsForm>({
    allAdsEnabled: true,
    bannerAdsEnabled: true,
    nativeAdsEnabled: false,
    interstitialAdsEnabled: true,
    interracialAdsEnabled: true,
    interstitialAdsShowCounter: 3,
    rewardedAdsEnabled: true,
    appOpenAdsEnabled: false,
    ...emptyIdFields,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await adsSettingsApi.get();
      if (data.adsSettings) {
        setSettings(data.adsSettings);
        setFormData({
          allAdsEnabled: data.adsSettings.allAdsEnabled,
          bannerAdsEnabled: data.adsSettings.bannerAdsEnabled,
          nativeAdsEnabled: data.adsSettings.nativeAdsEnabled,
          interstitialAdsEnabled: data.adsSettings.interstitialAdsEnabled,
          interracialAdsEnabled: data.adsSettings.interracialAdsEnabled,
          interstitialAdsShowCounter: normalizeInterstitialCounter(
            data.adsSettings.interstitialAdsShowCounter
          ),
          rewardedAdsEnabled: data.adsSettings.rewardedAdsEnabled,
          appOpenAdsEnabled: data.adsSettings.appOpenAdsEnabled,
          ...mapIdsFromApi(data.adsSettings),
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load ads settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (
    key: keyof Pick<
      AdsSettingsForm,
      | 'allAdsEnabled'
      | 'bannerAdsEnabled'
      | 'nativeAdsEnabled'
      | 'interstitialAdsEnabled'
      | 'interracialAdsEnabled'
      | 'rewardedAdsEnabled'
      | 'appOpenAdsEnabled'
    >
  ) => {
    setFormData((prev) => {
      if (key === 'allAdsEnabled') {
        const nextValue = !prev.allAdsEnabled;
        return {
          ...prev,
          allAdsEnabled: nextValue,
          bannerAdsEnabled: nextValue,
          nativeAdsEnabled: nextValue,
          interstitialAdsEnabled: nextValue,
          interracialAdsEnabled: nextValue,
          rewardedAdsEnabled: nextValue,
          appOpenAdsEnabled: nextValue,
        };
      }

      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const data = await adsSettingsApi.update(formData);
      setSettings(data.adsSettings);
      setFormData({
        allAdsEnabled: data.adsSettings.allAdsEnabled,
        bannerAdsEnabled: data.adsSettings.bannerAdsEnabled,
        nativeAdsEnabled: data.adsSettings.nativeAdsEnabled,
        interstitialAdsEnabled: data.adsSettings.interstitialAdsEnabled,
        interracialAdsEnabled: data.adsSettings.interracialAdsEnabled,
        interstitialAdsShowCounter: normalizeInterstitialCounter(
          data.adsSettings.interstitialAdsShowCounter
        ),
        rewardedAdsEnabled: data.adsSettings.rewardedAdsEnabled,
        appOpenAdsEnabled: data.adsSettings.appOpenAdsEnabled,
        ...mapIdsFromApi(data.adsSettings),
      });
      setSuccess(data.message || 'Ads settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save ads settings');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PageSkeleton variant="form" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Ads Settings</h1>
        <p className="text-gray-600 mt-1">Control ad modules and interstitial frequency</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            [
              ['allAdsEnabled', 'All Ads Enabled'],
              ['bannerAdsEnabled', 'Banner Ads Enabled'],
              ['nativeAdsEnabled', 'Native Ads Enabled'],
              ['interstitialAdsEnabled', 'Interstitial Ads Enabled'],
              ['interracialAdsEnabled', 'Interracial Ads Enabled'],
              ['rewardedAdsEnabled', 'Rewarded Ads Enabled'],
              ['appOpenAdsEnabled', 'App Open Ads Enabled'],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3"
            >
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <button
                type="button"
                onClick={() => handleToggle(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  formData[key] ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    formData[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interstitial Ads Show Counter
          </label>
          <select
            value={formData.interstitialAdsShowCounter}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                interstitialAdsShowCounter: normalizeInterstitialCounter(
                  Number(e.target.value)
                ),
              }))
            }
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {INTERSTITIAL_COUNTER_RANGE.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">AdMob / ad unit IDs</h2>
            <p className="text-sm text-gray-500 mt-1">
              Optional IDs sent to the API (e.g. ca-app-pub-…). Leave blank if not used.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner ads unit ID</label>
              <input
                type="text"
                value={formData.bannerAdsId}
                onChange={(e) => setFormData((prev) => ({ ...prev, bannerAdsId: e.target.value }))}
                placeholder="ca-app-pub-xxxxxxxx/1111111111"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Native ads unit ID</label>
              <input
                type="text"
                value={formData.nativeAdsId}
                onChange={(e) => setFormData((prev) => ({ ...prev, nativeAdsId: e.target.value }))}
                placeholder="ca-app-pub-xxxxxxxx/2222222222"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interstitial ads unit ID
              </label>
              <input
                type="text"
                value={formData.interstitialAdsId}
                onChange={(e) => {
                  const v = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    interstitialAdsId: v,
                    interracialAdsId: v,
                  }));
                }}
                placeholder="ca-app-pub-xxxxxxxx/3333333333"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                autoComplete="off"
              />
              <p className="text-xs text-gray-500 mt-1">
                Also updates interracial alias ID to the same value (API compatibility).
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interracial ads unit ID (alias)
              </label>
              <input
                type="text"
                value={formData.interracialAdsId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, interracialAdsId: e.target.value }))
                }
                placeholder="Same as interstitial if your backend expects both"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rewarded ads unit ID</label>
              <input
                type="text"
                value={formData.rewardedAdsId}
                onChange={(e) => setFormData((prev) => ({ ...prev, rewardedAdsId: e.target.value }))}
                placeholder="ca-app-pub-xxxxxxxx/4444444444"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">App open ads unit ID</label>
              <input
                type="text"
                value={formData.appOpenAdsId}
                onChange={(e) => setFormData((prev) => ({ ...prev, appOpenAdsId: e.target.value }))}
                placeholder="ca-app-pub-xxxxxxxx/5555555555"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        {settings && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm text-gray-700">
            Last updated: {new Date(settings.updatedAt).toLocaleString()}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {submitting ? 'Saving...' : 'Update Ads Settings'}
        </button>
      </form>
    </div>
  );
};

export default AdsSettings;
