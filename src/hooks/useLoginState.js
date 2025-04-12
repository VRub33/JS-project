import { useSelector } from 'react-redux';

export const useLoginState = () => {
  const logged = useSelector(state => state.auth.logged);
  return logged;
}; 