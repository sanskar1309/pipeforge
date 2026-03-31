import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import HelpPanel from './HelpPanel';

const App: React.FC = () => (
  <div>
    <HelpPanel />
    <PipelineToolbar />
    <PipelineUI />
    <SubmitButton />
  </div>
);

export default App;
