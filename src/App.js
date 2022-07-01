import React, { useState, useEffect } from 'react';

import './App.css';


// bootstrap css files
import 'bootstrap/dist/css/bootstrap.min.css';
//Bootstrap imports

import { Navbar, Container, Nav, Button, Offcanvas, Modal } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

const navItems = [
  {
    title: 'Home',
    link: '/'
  },
  {
    title: 'About',
    link: '/about'
  },
  {
    title: 'Contact',
    link: '/contact'
  }
]




function HeaderBar(params) {
  return (

    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">The Cocktail World</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {navItems.map((data, index) => {
              return (
                <Nav.Link href={data.link}>{data.title}</Nav.Link>
              )
            })}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

function Product_Modal(props) {
  console.log("modalopens")
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function App() {

  const [show, setShow] = useState(false);

  const [categoryList, setcategoryList] = useState([]);
  const [glassList, setglassList] = useState([]);
  // const [ingredientList, setingredientList] = useState([]);
  const [alcoholList, setalcoholList] = useState([]);


  const [searchKeyword, setSearchKeyword] = useState('a');
  const [outputResult, setOutputResult] = useState([]);
  const [mainOutput, setMainOutput] = useState([]);

  //For Checkbox filter
  const [checked, setChecked] = useState([]);

  //For Modal
  const [modalShow, setModalShow] = React.useState(false);




  useEffect(() => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list`)
      .then((resp) => {
        resp = resp.json()
        resp.then((value) => {
          let dataArr = value.drinks
          setcategoryList(dataArr);
        })
      })
      .then((error) => { console.log(error) })
  }, [])
  useEffect(() => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list`)
      .then((resp) => {
        resp = resp.json()
        resp.then((value) => {
          let dataArr = value.drinks
          setalcoholList(dataArr);
        })
      })
      .then((error) => { console.log(error) })
  }, [])
  useEffect(() => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list`)
      .then((resp) => {
        resp = resp.json()
        resp.then((value) => {
          let dataArr = value.drinks
          setglassList(dataArr);
        })
      })
      .then((error) => { console.log(error) })
  }, [])



  function searchBtnHandler() {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchKeyword}`)
      .then((resp) => {
        resp = resp.json()
        resp.then((data) => {
          data = data.drinks;
          if (data !== null) {
            setOutputResult(data);
            setMainOutput(data);
          } else {
            setOutputResult([]);
            setMainOutput([]);
          }
          setChecked([]);

        })
      })
      .then((error) => { console.log(error); })

  }

  function handleChecked(evt) {
    setChecked([])
    let updatedList = [...checked];

    if (evt.target.checked) {
      updatedList = [...checked, evt.target.value]
    } else {
      updatedList.splice(checked.indexOf(evt.target.value), 1);
    }

    setChecked(updatedList);

  }

  function applyFilters() {
    var updatedResult = [];

    mainOutput.forEach((value) => {
      if (checked.includes(value.strAlcoholic)) {
        updatedResult.push(value);
      } else if (checked.includes(value.strCategory)) {
        updatedResult.push(value);
      } else if (checked.includes(value.strGlass)) {
        updatedResult.push(value);
      }
    })

    setOutputResult(updatedResult);
    setShow(false);

  }


  return (
    <div className="App">
      <HeaderBar />
      <section className='Main-Section container'>

        <div className='d-flex justify-content-center'>
          <input className="form-control" style={{ "max-width": "500px" }} placeholder='Search here' onChange={(evt) => { setSearchKeyword(evt.target.value) }} />
        </div>

        <div>
          <Button variant="primary" className='m-1' onClick={() => { setShow(true) }}>Filters</Button>
          <Button variant="primary" className='m-1' onClick={() => { searchBtnHandler() }}  >Search</Button>
        </div>



        <Offcanvas show={show} onHide={() => { setShow(false) }}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Filters</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <>
              <h1>Categories</h1>
              <hr />
              <div className='grid-container'>
                {categoryList.map((data, index) => {
                  return (
                    <div className='grid-item' key={index}>
                      <input type="checkbox" value={data.strCategory} onChange={handleChecked} checked={checked.includes(data.strCategory)} />
                      <span>{data.strCategory}</span>
                    </div>
                  )
                })}
              </div>
            </>
            <>
              <h1>
                Alcohols
              </h1>
              <hr />
              <div className='grid-container'>
                {alcoholList.map((data, index) => {

                  return (
                    <div className='grid-item' key={index}>
                      <input type="checkbox" value={data.strAlcoholic} onChange={handleChecked} checked={checked.includes(data.strAlcoholic)} />
                      <span>{data.strAlcoholic}</span>
                    </div>

                  )
                })}
              </div>
            </>
            <>
              <h1>
                Glass
              </h1>
              <hr /><div className='grid-container'>
                {glassList.map((data, index) => {

                  return (
                    <div className='grid-item' key={index}>
                      <input type="checkbox" value={data.strGlass} onChange={handleChecked} checked={checked.includes(data.strGlass)} />
                      <span>{data.strGlass}</span>
                    </div>

                  )
                })}
              </div>
            </>
            <div className='d-flex flex-row-reverse'>
              <Button onClick={() => setChecked([])}>Clear All</Button>
              <Button onClick={() => applyFilters()}>Apply</Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>


      </section>

      <section>
        <div className='container items-grid-container ' >

          {
            outputResult.length !== 0 ? (
              outputResult.map((drink, index) => {
                return (
                  <div onClick={Product_Modal} >
                    <Card key={index}>
                      <Card.Body className="imgZoom" >
                        <Card.Img src={drink.strDrinkThumb} />
                        <Card.Title>
                          {drink.strDrink}
                        </Card.Title>
                      </Card.Body>
                      <Card.Footer>
                        Category : {drink.strCategory} <br />
                        Alcohols : {drink.strAlcoholic} <br />
                        Glass : {drink.strGlass}

                      </Card.Footer>
                    </Card>
                  </div >
                )
              })) : (
              <>
                No Item Found
              </>
            )

          }

        </div>
      </section >
    </div >
  );
}

export default App;
