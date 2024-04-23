import Designer from '@components/Designer';
import { createWithRemoteLoader } from '@kne/remote-loader';
import { globalPreset } from './preset';

const App = createWithRemoteLoader({
  modules: ['Global']
})(({ remoteModules, ...props }) => {
  const [Global] = remoteModules;
  return (
    <Global {...props} preset={globalPreset} themeToken={globalPreset.themeToken}>
      <Designer />
    </Global>
  );
});

export default App;
