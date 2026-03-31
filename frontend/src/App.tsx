import { lazy, Suspense } from 'react';
import { PipelineToolbar } from './toolbar';
import { SubmitButton } from './submit';
import HelpPanel from './HelpPanel';

const PipelineUI = lazy(() => import('./ui').then((m) => ({ default: m.PipelineUI })));

const App: React.FC = () => (
  <div>
    <HelpPanel />
    <PipelineToolbar />
    <Suspense fallback={null}>
      <PipelineUI />
    </Suspense>
    <SubmitButton />
  </div>
);

export default App;
