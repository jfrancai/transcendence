import { useStateContext } from '../../contexts/state';
import RenderIf from './RenderIf/RenderIf';

export function Search() {
  const { isSearchView } = useStateContext();
  return (
    <RenderIf some={[isSearchView]}>
      <p className="text-white">searchView</p>
    </RenderIf>
  );
}
