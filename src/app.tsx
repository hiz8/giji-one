import { Editor } from "./component/editor";
import { MemberToolbar } from "./component/member-toolbar";
import { HashtagViewer } from "./component/hashtag-viewer";

function App() {
  return (
    <div id="container">
      <MemberToolbar />
      <Editor />
      <HashtagViewer />
    </div>
  );
}

export default App;
