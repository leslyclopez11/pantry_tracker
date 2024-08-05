'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import {Box, Modal, Typography, Stack, TextField, Button, Backdrop, Fade, Accordion, AccordionSummary, AccordionDetails} from '@mui/material'
import { collection, doc, deleteDoc, getDoc, getDocs, query, setDoc} from "firebase/firestore";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export default function Home() {
  //store inventory helper
  const [inventory, setInventory] = useState([])
  //add and remove stuff
  const [open, setOpen] = useState(false)
  //store item name
  const [itemName, setItemName] = useState('')
  //filter
  //const [filteredInventory, setFilteredInventory] = useState([])
  //search Items
  const [searchItem, setSearchItem] = useState('')
  

  //update inventory func -> made it async meaning it doesnt block
  //code when fetching 
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    const filteredItems = inventoryList.filter(item =>
      item.name.toLowerCase().includes(searchItem.toLowerCase())
    )
    setInventory(filteredItems)
    
  }

  //remove items func
  const removeItem   = async (item) =>  {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  //add items func
  const addItem   = async (item) =>  {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
      
    }  else {
      await  setDoc(docRef, {quantity:  1})
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleSearch = async (event) => {
    const searchTerm = event.target.value.toLowerCase()
    setSearchItem(searchTerm)
    await updateInventory()
  }
  //filter inventory based on search 
  // const filterInventory = (searchItem,list) => {
  //   const filterItems = list.filter((item) =>
  //     item.name.toLowerCase().includes(searchItem)
  //   );
  //   setInventory(filterItems)
  // }

  

  const handleClearSearch = async () => {
    setSearchItem('')
    await updateInventory()
  }
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  
  const handleUpdateQuantity = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem || quantityToUpdate <= 0) return;

    const docRef = doc(collection(firestore, 'inventory'), selectedItem.id);
    await updateDoc(docRef, { quantity: quantityToUpdate });

    setQuantityToUpdate(0);
    setSelectedItem(null);
    setOpen(false);
    await updateInventory();
  };

  return (
  <Box  
    width="100vw" 
    height="100vh" 
    display="flex" 
    flexDirection="column"
    justifyContent="center" 
    alignItems="center"
    gap={2}
    sx={{ backgroundColor: '#f0f0f0' }}
  >  
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
        BackdropComponent={Backdrop}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        BackdropProps={{
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          slot: 'backdrop',
        }}
    >
      <Box
        position="absolute"
        top="50%"
        left="50%"
        width={400}
        bgcolor="white"
        border="2px solid #000"
        boxShadow={24}
        p={4}
        display="flex"
        flexDirection="column"
        gap={3}
        sx={{
          transform: "translate(-50%,-50%)"
        }}
      >
        <Typography variant="h5">Add Item</Typography>
        <Stack direction="row" spacing={2}>
          <TextField 
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value)
            }}        
          />
          <Button
            variant="outlined"
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
          >
            Add
          </Button>
        </Stack>
      </Box>
    </Modal>
    <Typography variant="h1" color={'primary'}>Pantry Tracker</Typography>
    <Button variant="contained" onClick={handleOpen}>
      Add New Item
    </Button>
    <Box mt={3} width="800px">
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchItem}
          onChange={handleSearch}
        />
        <Button variant="outlined" onClick={handleClearSearch}>
          Clear
        </Button>
      </Box>

      
    <Box border={'1px solid #333'}>
      <Box
        width="800px"
        height="100px"
        bgcolor={'#ADD8E6'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography variant={'h3'} color={'#000'} textAlign={'center'}>
          All Items
        </Typography>
      </Box>
      
      <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
        {inventory.map(({name, quantity}) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#e0e5ec'}
            paddingX={5}
          >
            <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
              Quantity: {quantity}
            </Typography>
            <Button variant="contained" onClick={() => removeItem(name)}>
              Remove
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
    
  </Box>
  )
}
