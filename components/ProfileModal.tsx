
import React, { useState, useEffect, useRef } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language, User } from '../types';
import { supabase } from '../supabaseClient';
import { X, User as UserIcon, Save, Image as ImageIcon, Clock, ShieldCheck, Lock, Phone, Upload, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (data: Partial<User>, newPassword?: string) => Promise<void>;
  lang: Language;
}

export const ProfileModal: React.FC<Props> = ({ isOpen, onClose, user, onSave, lang }) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [phone, setPhone] = useState(user.phone || '');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const [showLargeAvatar, setShowLargeAvatar] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setAvatar(user.avatar || '');
      setPhone(user.phone || '');
      setNewPassword('');
      setConfirmPassword('');
      setError(null);
      setSuccess(null);
      setImageError(false);
    }
  }, [user, isOpen]);

  useEffect(() => {
    setImageError(false);
  }, [avatar]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Basic validation
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file.");
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError("Image size must be less than 2MB.");
        return;
      }

      setUploading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatar(publicUrl);
      setSuccess("Image uploaded successfully!");
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await onSave({ name, avatar, phone }, newPassword || undefined);
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        setSuccess(null);
        // Optional: onClose(); 
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = () => {
    if (!user.subscriptionEnd) return 0;
    return Math.max(0, Math.ceil((user.subscriptionEnd - Date.now()) / (1000 * 60 * 60 * 24)));
  };

  return (
    <>
      {/* Large Avatar Preview Modal */}
      {showLargeAvatar && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setShowLargeAvatar(false)}>
          <img
            src={avatar || "https://via.placeholder.com/400"}
            className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl scale-100 animate-in zoom-in-95"
            alt="Profile Large"
            onError={() => setImageError(true)}
          />
          <button className="absolute top-4 right-4 text-white hover:text-red-400"><X className="w-8 h-8" /></button>
        </div>
      )}

      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">

        <div className="bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-700 overflow-hidden scale-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900 sticky top-0 z-10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-500" />
              {t.profileSettings}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Avatar Area */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div
                  onClick={() => setShowLargeAvatar(true)}
                  className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-4 border-slate-600 cursor-pointer hover:border-blue-500 transition shadow-xl"
                >
                  {avatar && !imageError ? (
                    <img
                      src={avatar}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <span className="text-3xl font-bold text-slate-400">{name.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => setShowAvatarInput(!showAvatarInput)}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg border-2 border-slate-800 transition transform hover:scale-110"
                  title="Change Avatar"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conditional Avatar Input */}
            {showAvatarInput && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-1 px-1">
                  <label className="text-xs text-blue-400 font-bold">Image URL</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                    {uploading ? 'Uploading...' : 'Upload File'}
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*"
                />

                <div className="relative">
                  <ImageIcon className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className={`w-full bg-slate-900 border ${imageError ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-blue-500/50'} rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    placeholder="https://example.com/image.png"
                    autoFocus
                  />
                </div>
                {imageError && avatar && (
                  <p className="text-[10px] text-red-400 mt-2 text-center animate-in fade-in slide-in-from-top-1">
                    ⚠️ This link doesn't seem to be a direct image. <br />
                    Try right-clicking the image and choosing "Copy Image Address" or upload a file.
                  </p>
                )}
              </div>
            )}

            {error && <div className="p-3 bg-red-500/20 text-red-300 text-sm rounded-lg border border-red-500/30">{error}</div>}
            {success && <div className="p-3 bg-green-500/20 text-green-300 text-sm rounded-lg border border-green-500/30">{success}</div>}

            {/* Basic Info */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t.nameLabel}</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>



            {/* Phone Number (New) */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>

            {/* Password Change Section */}
            <div className="pt-4 border-t border-slate-700">
              <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Change Password
              </h3>
              <div className="space-y-3">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="New Password (leave blank to keep)"
                />
                {newPassword && (
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="Confirm New Password"
                  />
                )}
              </div>
            </div>

            {/* Subscription Info */}
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Subscription Status
                </span>
                <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" /> Expires On
                </span>
                <span className="text-white font-mono text-sm">
                  {user.subscriptionEnd ? new Date(user.subscriptionEnd).toLocaleDateString() : 'Lifetime / Trial'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Days Remaining</span>
                <span className={`font-bold font-mono ${getDaysRemaining() < 3 ? 'text-red-500' : 'text-white'}`}>
                  {getDaysRemaining()} Days
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <span className="animate-spin">⌛</span> : <Save className="w-5 h-5" />}
              {t.saveChanges}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
