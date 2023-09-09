import { Editor } from "./component/editor";
import { AppBar } from "./component/app-bar";
import { Logo } from "./component/logo";
import { MemberToolbar } from "./component/member-toolbar";
import { HashtagViewer } from "./component/hashtag-viewer";

function App() {
  return (
    <div id="layout">
      <AppBar>
        <Logo />
        <MemberToolbar />
      </AppBar>
      <Editor />
      <HashtagViewer />
    </div>
  );
}

export default App;
