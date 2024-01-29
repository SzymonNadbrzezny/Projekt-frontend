import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import styled from "styled-components";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import RTIMenuBar from "./RTIComponents/RTIMenuBar";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Document from "@tiptap/extension-document";
import { useFormContext } from "react-hook-form";
import Image from "@tiptap/extension-image";
import { getBase64 } from "@/Utils/getBase64";

const StyledEditor = styled.div`
  > div:nth-child(2) {
    border: 1px solid black !important;
    padding: 20px;
    min-height: 500px;
    display: flex;
    div,
    input {
      flex: 1;
      border: none;
      outline: none;
    }
    img {
      max-width: 300px;
      border-radius: 5px;
    }
  }
  .tiptap .is-empty::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
`;
function RichTextInput({
  description,
  title,
  onChange,
}: {
  description: string;
  title: string;
  onChange: (a: string) => void;
}) {
  const CustomDocument = Document.extend({
    content: "heading block*",
  });
  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure(),
    CustomDocument,
    Image.configure({
      allowBase64: true,
    }),
    StarterKit.configure({
      document: false,
    }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === "heading" && node.attrs.level === 1) {
          return "Tytuł";
        }

        return "Treśc";
      },
      includeChildren: false,
    }),
    Typography,
  ];
  const content = title ?? "" + description ?? "";
  const { setValue, getValues } = useFormContext();
  return (
    <StyledEditor>
      <EditorProvider
        extensions={extensions}
        editorProps={{
          handleDrop: (view, event, slice, moved) => {
            if (
              !moved &&
              event.dataTransfer &&
              event.dataTransfer.files &&
              event.dataTransfer.files[0]
            ) {
              const image = event.dataTransfer.files[0];
              // if dropping external files
              const pic = getValues("picture");
              if (pic) {
                if (Array.isArray(pic)) {
                  if (pic.length > 0) {
                    setValue("picture", image);
                  } else {
                    setValue("picture", [...pic, image]);
                  }
                } else {
                  setValue("picture", [pic, image]);
                }
              } else {
                setValue("picture", image);
              }
              getBase64(image).then((res) => {
                const { schema } = view.state;
                const coordinates = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });
                console.log(coordinates, "coordinates");
                const node = schema.nodes.image.create({
                  src: res,
                }); // creates the image element
                const transaction = view.state.tr.insert(
                  coordinates?.pos,
                  node
                ); // places it in the correct position
                console.log(transaction, "transaction");
                console.log(view.dispatch(transaction));
              });
              return true; // handled
            }
            return false;
          },
        }}
        content={content}
        slotBefore={<RTIMenuBar />}
        onUpdate={({ editor }) => onChange(editor.getHTML())}
      >
        {" "}
      </EditorProvider>
    </StyledEditor>
  );
}

export default RichTextInput;
