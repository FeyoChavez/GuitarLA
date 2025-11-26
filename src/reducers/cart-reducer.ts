import type { CartItem, Guitar } from "../types";
import {db} from "../data/db"

// funciones
export type CartActions =
    {type: 'add-to-cart', payload: {item:Guitar}} |
    {type: 'remove-from-cart', payload: {id:Guitar['id']}} |
    {type: 'decrease-quantity', payload: {id:Guitar['id']}} |
    {type: 'increase-quantity', payload: {id:Guitar['id']}} |
    {type: 'clear-cart'}

// types que se utlizan y lugar de almacenamiento
export type CartState = {
    data: Guitar[]
    cart: CartItem[]
}

// inicializacion del carrito
    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

// valor de los types que declaramos
export const initialState : CartState = {
    data: db,
    cart: initialCart()
}

    const MIN_ITEMS = 1
    const MAX_ITEMS = 5

export const cartReducer = (
    // favorece el autocompletado
    state: CartState = initialState,
    action: CartActions

) => {

    // Anadir al carrito
    if(action.type === 'add-to-cart') {

        const itemExists = state.cart.find(guitar => guitar.id === action.payload.item.id)
        let updatedCart : CartItem[] = []

        if(itemExists ) { // existe en el carrito
           updatedCart = state.cart.map(item => {
            if(item.id === action.payload.item.id) { // si el elemento que esta agregando el usuario repetido
                if(item.quantity < MAX_ITEMS) {
                    return {...item, quantity: item.quantity + 1}
                } else {
                return item // se mantiene la info del carrito
            }
            } else {
                return item
            }
           })
        } else {
            const newItem : CartItem = {...action.payload.item, quantity : 1}
            updatedCart = [...state.cart, newItem]
        }

        return {
            ...state,
            cart: updatedCart
        }
    }

    // Eliminar del carrito
    if(action.type === 'remove-from-cart'){
        const cart = state.cart.filter(item => item.id !== action.payload.id)
        return {
            ...state,
            cart
        }
    }

    // Reducir la cantidad de un item en el carrito
    if(action.type === 'decrease-quantity') {
            const cart = state.cart.map( item => {
            if(item.id === action.payload.id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        return {
            ...state,
            cart
        }
    }

    // Aumentar la cantidad de un item en el carrito
    if(action.type === 'increase-quantity'){

            const cart = state.cart.map( item => {
            if(item.id === action.payload.id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })

        return {
            ...state,
            cart
        }
    }

    // Vaciar el carrito
    if(action.type === 'clear-cart') {
        return {
            ...state,
            cart: [] // enviamos el arreglo vacio
        }
    }

    return state
}