import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Save, Smartphone } from 'lucide-react';
import { appSettingsApi } from '../services/api';
import PageSkeleton from '../components/PageSkeleton';

interface AppSettingsData {
  _id: string;
  appUpdateRequired: boolean;
  appUrl: string;
  createdAt: string;
  updatedAt: string;
}

const AppSettings = () => {
  const [settings, setSettings] = useState<AppSettingsData | null>(null);
  const [formData, setFormData] = useState({
    appUpdateRequired: false,
    appUrl: '',
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
      setError('');
      const data = await appSettingsApi.get();
      if (data.appSettings) {
        setSettings(data.appSettings);
        setFormData({
          appUpdateRequired: data.appSettings.appUpdateRequired,
          appUrl: data.appSettings.appUrl ?? '',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load app settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const data = await appSettingsApi.update({
        appUpdateRequired: formData.appUpdateRequired,
        appUrl: formData.appUrl,
      });
      if (data.appSettings) {
        setSettings(data.appSettings);
        setFormData({
          appUpdateRequired: data.appSettings.appUpdateRequired,
          appUrl: data.appSettings.appUrl ?? '',
        });
      }
      setSuccess(data.message || 'App settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save app settings');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PageSkeleton variant="form" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Smartphone className="w-8 h-8 text-indigo-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">App Settings</h1>
          <p className="text-gray-600 mt-1">
            Control whether clients must update and where to send users (store URL).
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <label className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-4">
          <div>
            <span className="text-sm font-medium text-gray-800 block">App update required</span>
            <span className="text-xs text-gray-500 mt-1 block">
              When enabled, the mobile app should prompt or enforce update using the URL below.
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, appUpdateRequired: !prev.appUpdateRequired }))
            }
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
              formData.appUpdateRequired ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                formData.appUpdateRequired ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">App URL</label>
          <input
            type="url"
            value={formData.appUrl}
            onChange={(e) => setFormData((prev) => ({ ...prev, appUrl: e.target.value }))}
            placeholder="https://play.google.com/store/apps/details?id=..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="off"
          />
          <p className="text-xs text-gray-500 mt-2">
            Store or landing page link. Leave empty to clear (sends empty string on save).
          </p>
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
          {submitting ? 'Saving...' : 'Update App Settings'}
        </button>
      </form>
    </div>
  );
};

export default AppSettings;
