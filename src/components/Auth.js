import React, { useState } from 'react'
// import { useQuery } from '@apollo/react-hooks'
import Input from './ui/Input'
import Button from './ui/Button'
import ImageLogo from '../assets/images/logo.js'
import Particles from 'react-tsparticles'

export default () => {
    // const { loading, error, data } = useQuery()
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    return (
        <main className="auth">
            <form>
                <div className="logo">
                    {ImageLogo}
                </div>

                <Input options={{
                    type: 'text',
                    value: login,
                    placeholder: 'Enter Login',
                    onChange: (e) => {
                        setLogin(e.target.value)
                    }
                }} />
                <Input options={{
                    type: 'password',
                    value: password,
                    placeholder: 'Enter Password',
                    onChange: (e) => {
                        setPassword(e.target.value)
                    }
                }} />
                <Button options={{
                    type: 'inactive',
                    handler: () => {
                        console.log({
                            login, password
                        })
                        setLogin('')
                        setPassword('')
                    }
                }}>
                    <p>Sign In</p>
                </Button>
            </form>
            <Particles
                id="tsparticles"
                options={{
                    "particles": {
                        "number": {
                          "value": 10,
                          "density": {
                            "enable": true,
                            "value_area": 800
                          }
                        },
                        "color": {
                          "value": "#5E3FA1",
                        },
                        "shape": {
                          "type": "circle",
                          "stroke": {
                            "width": 45,
                            "color": "#5E3FA1"
                          },
                          "polygon": {
                            "nb_sides": 6
                          },
                        },
                        "opacity": {
                          "value": .045,
                          "random": true,
                          "anim": {
                            "enable": false,
                            "speed": 0.1,
                            "opacity_min": .01,
                            "sync": false
                          }
                        },
                        "size": {
                          "value": 175,
                          "random": true,
                          "anim": {
                            "enable": true,
                            "speed": .5,
                            "size_min": 0.45,
                            "sync": false
                          }
                        },
                        "move": {
                          "enable": true,
                          "speed": 2,
                          "direction": "none",
                          "random": true,
                          "straight": true,
                          "out_mode": "out",
                          "bounce": true,
                          "attract": {
                            "enable": true,
                            "rotateX": 600,
                            "rotateY": 1200
                          }
                        }
                      },
                      "retina_detect": true
                }}
            />
        </main>
    )
}