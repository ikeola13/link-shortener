import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import TextField from '@mui/material/TextField'
import SendIcon from '@mui/icons-material/Send'
import loaderImg from '../loader.gif'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import axios from 'axios'
import Snackbar from '@mui/material/Snackbar'
import CloseIcon from '@mui/icons-material/Close'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

function Dashboard () {
  let textInput = React.createRef()
  const [url, setUrl] = useState('')
  const [newUrl, setNewUrl] = useState('New Url')
  const [loader, setLoader] = useState(false)
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = useState('')
  const [urlHistoryList, setUrlHistoryList] = useState([])

  useEffect(() => {
    if (urlHistoryList.length > 0) {
      setUrlHistoryList(JSON.parse(localStorage.getItem('urlHistory')))
    }
    console.log(JSON.parse(localStorage.getItem('urlHistory')))
    console.log(urlHistoryList)
  }, [])

  const SearchButton = () => (
    <IconButton onClick={Shorten}>
      <Button variant='contained' endIcon={<SendIcon />} align='right'>
        Shorten
      </Button>
    </IconButton>
  )

  const ContentCopier = () => (
    <CopyToClipboard onCopy={onCopy} text={newUrl}>
      <IconButton>
        <ContentCopyIcon />
      </IconButton>
    </CopyToClipboard>
  )

  const onCopy = () => {
    setMessage('New link copied!')
    setOpen(true)
  }

  const handleChange = e => {
    setUrl(e.target.value)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const getLatestList = () => {
    setUrlHistoryList(JSON.parse(localStorage.getItem('urlHistory')))
  }

  const action = (
    <React.Fragment>
      <IconButton
        size='small'
        aria-label='close'
        color='inherit'
        onClick={handleClose}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </React.Fragment>
  )

  const Shorten = () => {
    setLoader(true)
    console.log(url)
    const user = JSON.stringify({
      long_url: url
    })
    axios
      .post('https://api-ssl.bitly.com/v4/shorten', user, {
        headers: {
          Authorization: 'Bearer f71373cdd408b53d2c228f3b5f08c69212de3e04',
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        setLoader(false)
        console.log(res.data)
        setNewUrl(res.data.link)
        const newArray = JSON.parse(localStorage.getItem('urlHistory'))
        newArray.push({
          url: res.data.link,
          date: res.data.created_at.slice(0, 10)
        })
        localStorage.setItem('urlHistory', JSON.stringify(newArray))
        getLatestList()
        console.log(newArray)
      })
      .catch(function (error) {
        setLoader(false)
        console.log(error.response.data.message)
        setMessage(error.response.data.message)
        setOpen(true)
      })
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* beginning of Navbar */}
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Url Shortener
          </Typography>
        </Toolbar>
      </AppBar>
      {/* end of Navbar */}
      {/* beginning of search bar */}
      <div className='search'>
        <TextField
          fullWidth
          id='outlined-basic'
          label='Enter Url'
          variant='outlined'
          InputProps={{ endAdornment: <SearchButton /> }}
          onChange={handleChange}
        />
      </div>
      {/* end of search bar */}
      {loader ? (
        <div className='loaderBox'>
          <img src={loaderImg} className='loader' />
        </div>
      ) : null}
      <div className='search'>
        <TextField
          fullWidth
          id='outlined-basic'
          value={newUrl}
          variant='outlined'
          InputProps={{ endAdornment: <ContentCopier /> }}
          disabled
        />
      </div>
      <div className='urls'>
        <div>
          <h2>History</h2>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead className='tableHead'>
                <TableRow>
                  <TableCell className='tableHeadText'>Url Link</TableCell>
                  <TableCell className='tableHeadText' align='right'>
                    Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {urlHistoryList.map(row => (
                  <TableRow
                    key={row.url}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component='th' scope='row'>
                      {row.url}
                    </TableCell>
                    <TableCell align='right'>{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </Box>
  )
}

export default Dashboard
