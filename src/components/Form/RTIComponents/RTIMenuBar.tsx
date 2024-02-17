import { useCurrentEditor } from "@tiptap/react";
import React, { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import styled from "styled-components";
import Test from "../../../pages/Test";
import Trash from "@assets/trash.svg";
const MenuBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  gap: 2px;
  background-color: ${({ theme }) => theme.colors.primary["200"]};
  padding: 5px;
  border: 1px solid black;
  border-bottom: none;
  div {
    display: flex;
    margin-inline: 4px;
    border: 1px solid black;
    gap: 5px;
  }
  button,
  select {
    width: max-content;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border: none;
    background-color: ${({ theme }) => theme.colors.primary["200"]};
    color: ${({ theme }) => theme.colors.primary["800"]};
    &:disabled {
      color: ${({ theme }) => theme.colors.primary["300"]};
      background-color: ${({ theme }) => theme.colors.primary["100"]};
    }
    &:not(:disabled):hover {
      background-color: ${({ theme }) => theme.colors.primary["300"]};
    }
    &.is-active {
      background-color: ${({ theme }) => theme.colors.secondary["200"]};
    }
  }
  ul,
  ol {
    padding-left: 15px;
  }
`;
function RTIMenuBar() {
  const { editor } = useCurrentEditor();
  const selectRef = useRef<HTMLSelectElement>(null);
  if (!editor) {
    return null;
  }
  const selectValue = () => {
    const node = editor.state.selection.$from.node();
    if (node.type.name === "paragraph") {
      return "paragraph";
    }
    if (node.type.name === "heading") {
      return `h${node.attrs.level}`;
    }
  };
  useEffect(() => {
    const val = selectValue();
    selectRef.current.value = val;
  }, [editor.state.selection.$from.node()]);
  const { register } = useFormContext();

  return (
    <MenuBar>
      {
        <button
          onClick={() => {
            editor
              .chain()
              .deleteNode(editor.state.selection.$from.node().type.name)
              .run();
          }}
        >
          <img src={Trash} />
        </button>
      }
      <select
        ref={selectRef}
        className={
          editor.isActive("heading") || editor.isActive("paragraph")
            ? "is-active"
            : ""
        }
        onChange={(e) => {
          if (e.target.value === "paragraph") {
            editor.chain().focus().setParagraph().run();
          } else {
            editor
              .chain()
              .focus()
              .setHeading({ level: parseInt(e.target.value[1]) })
              .run();
          }
        }}
      >
        <option value="paragraph">Paragraf</option>
        <option value="h1">Nagłówek 1</option>
        <option value="h2">Nagłówek 2</option>
        <option value="h3">Nagłówek 3</option>
        <option value="h4">Nagłówek 4</option>
        <option value="h5">Nagłówek 5</option>
        <option value="h6">Nagłówek 6</option>
      </select>
      <div>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <strong>b</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <i>i</i>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          <s>s</s>
        </button>
      </div>

      <div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <ul>
            <li>...</li>
          </ul>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <ol>
            <li>...</li>
          </ol>
        </button>
      </div>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        Linia pozioma
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        Nowa linia
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        cofnij
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        powtórz
      </button>

      {/* <button
        onClick={() => editor.chain().focus().setColor("#958DF1").run()}
        className={
          editor.isActive("textStyle", { color: "#958DF1" }) ? "is-active" : ""
        }
      >
        purple
      </button> */}
    </MenuBar>
  );
}

export default RTIMenuBar;
