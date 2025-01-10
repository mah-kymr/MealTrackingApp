return (
  <div className="min-h-screen bg-brand-background py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <ProfileHeader onBack={() => navigate("/dashboard")} />

      <div className="p-6 space-y-6">
        <InputField
          label="新しいユーザー名"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          error={errors.username}
          placeholder="新しいユーザー名"
        />
        <button onClick={handleUpdateUsername} className="w-full bg-brand-primary text-white py-2 px-4 rounded-md hover:bg-brand-secondary focus:outline-none">
          ユーザー名を更新
        </button>

        <InputField
          label="現在のパスワード"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={errors.currentPassword}
        />
        <InputField
          label="新しいパスワード"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.newPassword}
        />
        <InputField
          label="確認用パスワード"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />
        <button onClick={handleUpdatePassword} className="w-full bg-brand-primary text-white py-2 px-4 rounded-md hover:bg-brand-secondary focus:outline-none">
          パスワードを更新
        </button>

        <button
          onClick={() => setIsDeleting(true)}
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 mt-4"
        >
          アカウントを削除
        </button>
      </div>

      <ConfirmationModal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDeleteAccount}
        message="本当にアカウントを削除しますか？"
      />
    </div>
  </div>
);

export default ProfilePage;