import React from "react";

const ProfileHeader = ({ onBack }) => (
  <div className="bg-brand-secondary text-white px-6 py-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold">プロフィール管理</h1>
    <button
      onClick={onBack}
      className="bg-white text-brand-primary hover:bg-brand-background font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      ダッシュボードに戻る
    </button>
  </div>
);

export default ProfileHeader;
