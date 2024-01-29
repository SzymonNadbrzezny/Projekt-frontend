import styled, { css } from "styled-components";
import { PropsWithChildren } from "react";
import StyledLink from "../Utils/StyledLink";

type PostCardProps = PropsWithChildren & {
  postId: string;
  title: string;
  img?: string;
  minified?: boolean;
};
const Body = styled.div<{ $minified?: boolean }>`
  display: flex;
  position: relative;
  gap: ${({ $minified }) => ($minified ? "0" : "2.5rem")};
  flex: 1;
  width: 100%;
  border-radius: 0.9375rem;
  background: ${({ theme }) => theme.colors.primary["200"]};
  flex-direction: ${({ $minified }) => ($minified ? "column" : "row")};
  padding: 1rem;
  ${({ $minified }) =>
    $minified &&
    css`
      &:has(img) {
        padding-top: 9rem;
        padding-inline: 0;
      }
    `}
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
  justify-content: center;
  align-items: stretch;
`;
const PostImage = styled.img<{ $minified?: boolean }>`
  width: clamp(10rem, 20%, 20rem);
  ${({ $minified }) =>
    $minified &&
    css`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 60%;
    `}
  @media (max-width: 426px) {
    width: 100%;
  }
  object-fit: cover;
  border: ${({ $minified }) => ($minified ? "none" : "2px solid")};
  border-color: ${({ theme }) => theme.colors.primary["600"]};
  border-radius: 0.9375rem;
`;
const PostBody = styled.div<{ $minified?: boolean }>`
  z-index: 1;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  background: linear-gradient(
    transparent 0%,
    ${({ theme }) => theme.colors.primary["200"]} 10%
  );
  ${({ $minified }) =>
    $minified &&
    css`
      border-top-right-radius: 0;
      border-top-left-radius: 0;

      img ~ & {
        padding-top: 1rem;
        padding-inline: 1rem;
      }
      &:only-child p {
        -webkit-line-clamp: 9 !important;
      }
    `}
`;
const PostTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary["500"]};
`;
const PostContent = styled.p<{ $minified?: boolean }>`
  display: -webkit-box;
  width: 100%;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ $minified }) => ($minified ? "4" : "5")};
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 1.5rem */
  color: ${({ theme }) => theme.colors.primary["800"]};
`;
const PostFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  align-self: flex-end;
`;
function PostCard({
  minified = false,
  children,
  title,
  postId,
  img,
}: PostCardProps) {
  return (
    <Body $minified={minified}>
      {img && (
        <PostImage $minified={minified} src={img} title={title + "image"} />
      )}
      <PostBody $minified={minified}>
        <PostTitle
          dangerouslySetInnerHTML={{ __html: title as string }}
        ></PostTitle>
        <PostContent
          $minified={minified}
          dangerouslySetInnerHTML={{ __html: children as string }}
        ></PostContent>
        <PostFooter>
          <StyledLink linkType="button" to={`/posts/${postId}`} outlined>
            Czytaj dalej...
          </StyledLink>
        </PostFooter>
      </PostBody>
    </Body>
  );
}

export default PostCard;
