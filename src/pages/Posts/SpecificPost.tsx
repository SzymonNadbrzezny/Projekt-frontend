import { ApiClient, queryClient } from "@/API/apiClient";
import { useGetPost } from "@/API/hooks/PostHooks";
import StyledLink from "@/components/Utils/StyledLink";
import { useLoaderData } from "react-router-dom";
import styled from "styled-components";
const Body = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
`;
const NavRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px;
`;
const PostBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${({ theme }) => theme.colors.primary["200"]};
  padding: 10px;
  border-radius: 10px;
  img {
    margin: 0 auto;
    max-width: 300px;
  }
`;
function SpecificPost() {
  const data = useLoaderData() as { id: number };
  const postQuery = useGetPost(data.id);
  const post = postQuery.data?.data;
  let postContent = post?.description;
  for (let p in post?.pictures) {
    postContent = postContent.replace(
      `{img:${p}}`,
      `<img src="${post.pictures[p]}" />`
    );
  }
  return (
    postQuery.isSuccess && (
      <Body>
        <NavRow>
          <StyledLink linkType="button" outlined to="/posts">
            Powrót
          </StyledLink>
        </NavRow>
        <h1 dangerouslySetInnerHTML={{ __html: post.title as string }}></h1>
        <PostBody
          id="body"
          dangerouslySetInnerHTML={{ __html: postContent }}
        ></PostBody>
      </Body>
    )
  );
}

export const loader = async ({ params }: { params: { id: number } }) => {
  queryClient.prefetchQuery(["post", params.id], () => {
    return ApiClient.getPost(params.id);
  });
  return { id: params.id };
};
export default SpecificPost;
