
const useNotificationSound = () => {
  const playSound = () => {
    const audio = new Audio("/mp3/notificationSound.mp3");
    audio.play();
  };

  return playSound;
};

export default useNotificationSound;
