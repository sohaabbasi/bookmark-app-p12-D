import React, { useState } from "react";
import { Button, TextField, Grid } from "@material-ui/core";
import { useQuery, useMutation, gql } from "@apollo/client";
import { navigate, navigateTo } from "gatsby";
import "./style.css";
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd"
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from "@material-ui/core/Paper"

type dataType = {
  id: string;
  name: string;
  url: string;
};

const GET_BOOKMARK = gql`
  query {
    bookmark {
      id
      name
      url
    }
  }
`;

const ADD_BOOKMARK = gql`
  mutation addBookmark($name: String!, $url: String!) {
    addBookmark(name: $name, url: $url) {
      id
      name
      url
    }
  }
`;

const REMOVE_BOOKMARK = gql`
  mutation removeBookmark($id: ID!) {
    removeBookmark(id: $id) {
      id
      name
      url
    }
  }
`;

const Home = () => {
  const [name, setName] = useState<string>("");
  const [siteUrl, setSiteURl] = useState<string>("");
  const [addBookmark] = useMutation(ADD_BOOKMARK);
  const [removeBookmark] = useMutation(REMOVE_BOOKMARK);

  const add = () => {
    console.log("NAme: ", name);
    console.log("URL : ", siteUrl);
    addBookmark({
      variables: {
        name: name,
        url: siteUrl,
      },
      refetchQueries: [{ query: GET_BOOKMARK }],
    });
  };

  const remove = (id: string) => {
    removeBookmark({
      variables: {
        id: id,
      },
      refetchQueries: [{ query: GET_BOOKMARK }],
    });
  };

  const { loading, error, data } = useQuery(GET_BOOKMARK);
  
  if (loading) {
    return (
    <CircularProgress className="loader" variant="static"  />
    )
  }

  if (error) {
    console.log(error)
  }
  
  
  
  return (
    <div >
      <Paper className="paper" elevation={4} style={{ width: "500px", margin: " 70px auto", minHeight: "200px" }}>
      <h1 className="head">BOOKMARK-APP</h1>
      
          <form
        style={{ margin: "10px" }}
        >

            <TextField
              style={{ margin: "10px 0px" }}
              id="filled-text1"
              label="Name"
              variant="outlined"
              name={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              style={{ margin: "10px 0px" }}
              id="filled-text2"
              label="URL"
              variant="outlined"
              name={siteUrl}
              onChange={(e) => setSiteURl(e.target.value)}
              fullWidth
            />
            <Button
              className="btn"
              variant="contained"
              onClick={add}
              startIcon={<PlaylistAddIcon />}

            >
              ADD TO BOOKMARK
            </Button>
            </form>
            </Paper>

      {/* {console.log(data && data.bookmark)} */}
      <Grid container spacing={1} direction="column" justify="center">
        {data &&
          data.bookmark.map((d: dataType) => {
            return (
              <Grid  key={d.id}>
                <div  className="dataList">
                  <h1>{d.name}</h1>
                  <br/>
                  <a style={{fontSize:"22px"}} href={d.url} target='_blank'>{d.url}</a>
                  <br/>

                  <div className="listBtn">
                    <Button
                      onClick={() => remove(d.id)}
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      color="secondary"
                    >
                      Remove
                    </Button>

                    <Button
                      onClick={() => navigateTo(d.url) }
                      variant="contained"
                      color="primary"
                      endIcon={<SendIcon /> }
                    >
                      Visit
                    </Button>
                  </div>
                </div>
              </Grid>
            );
          })}
      </Grid>
    </div>
  );
};

export default Home;
