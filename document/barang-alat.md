## Barang dan Alat

## Create Alat

Endpoint : POST /api/alat

Headers :

- Authorization : Token

Request Body :

```json
{
  "name": "Mesin 3D Print",
  "image": "url",
  "description": "ini adalah 3D Print"
}
```

Response Body:

````json
{
    "data": {
        "id": 1,
        "name": "Mesin 3D Print",
        "image": "url",
        "description": "ini adalah 3D Print",
    }
}
Response Body(failed):
```json
{
    "errors": "barang tidak berhasil ditambahkan"
}
````

## Create Barang

Endpoint : POST /api/alat

Headers :

- Authorization : Token

Request Body :

```json
{
  "name": "Buku Perpan",
  "type": "Buku",
  "image": "url",
  "penerbit": "Jordan",
  "tahun terbit": 2025,
  "description": "ini adalah Buku Perpan"
}
```

Response Body:

````json
{
    "data": {
        "id": 1,
        "type": "Buku",
        "name": "Buku Perpan",
        "image": "url",
         "penerbit": "Jordan", //Opsional 
         "tahun terbit" : 2025, //Opsional
        "description": "ini adalah Buku Perpan",
    }
}
Response Body(failed):
```json
{
    "errors": "Barang tidak berhasil ditambahkan"
}
````

## Get Barang

Endpoint : GET /api/barang/:barangId

Headers :

- Authorization : Token

Response Body:

````json
{
    "data": {
        "id": 1,
        "name": "Buku Perpan",
        "image": "url",
        "description": "ini adalah Buku Perpan",
    }
}
Response Body(failed):
```json
{
    "errors": "Barang tidak berhasil dipanggil"
}
````

## Get Alat

Endpoint : GET /api/alat/:alatId

Headers :

- Authorization : Token

Response Body:

````json
{
    "data": {
        "id": 1,
        "name": "Mesin 3D Print",
        "image": "url",
        "description": "Mesin 3D Print",
    }
}
Response Body(failed):
```json
{
    "errors": "Alat tidak berhasil dipanggil"
}
````

## Update Alat

Endpoint : PUT /api/alat/:alatId

Headers :

- Authorization : Token

Request Body :

```json
{
  "name": "Mesin 3D Print",
  "image": "url",
  "description": "ini adalah 3D Print"
}
```

Response Body:

````json
{
    "data": {
        "id": 1,
        "name": "Mesin 3D Print",
        "image": "url",
        "description": "ini adalah 3D Print",
    }
}
Response Body(failed):
```json
{
    "errors": "update alat gagal"
}
````

## Update Barang

Endpoint : PUT /api/barang/:barangId

Headers :

- Authorization : Token

Request Body :

```json
{
  "name": "Buku Perpan",
  "image": "url",
  "description": "ini adalah Buku Perpan"
}
```

Response Body:

````json
{
    "data": {
        "id": 1,
        "name": "Buku Perpan",
        "image": "url",
        "description": "ini adalah Buku Perpan",
    }
}
Response Body(failed):
```json
{
    "errors": "Update Barang Gagal"
}
````

## Update Alat

Endpoint : PUT /api/alat/:alatId

Headers :

- Authorization : Token

Request Body :

```json
{
  "name": "Mesin 3D Print",
  "image": "url",
  "description": "ini adalah 3D Print"
}
```

Response Body:

````json
{
    "data": {
        "id": 1,
        "name": "Mesin 3D Print",
        "image": "url",
        "description": "ini adalah 3D Print",
    }
}
Response Body(failed):
```json
{
    "errors": "update alat gagal"
}
````

## DELETE Barang

Endpoint : DELETE /api/barang/:barangId

Headers :

- Authorization : Token

Response Body:

```json
{
  "data": true
}
```

## DELETE Alat

Endpoint : DELETE /api/alat/:alatId

Headers :

- Authorization : Token

Response Body:

```json
{
  "data": true
}
```
# API Search Barang dan Alat

Endpoint : GET /api/search?query=<keyword>

## Headers:
- Authorization: Token

## Request Params:
| Parameter | Tipe  | Deskripsi |
|-----------|-------|-----------|
| `query`   | `string` | Kata kunci pencarian untuk barang dan alat |

Query Params :
- Name : string, barang dan alat alphabet
- Tahun Terbit : number, first-middle-last number
---

## Response Body (Success)

```json
{
    "data": {
        "barang": [
            {
                "id": 1,
                "name": "Buku Perpan",
                "image": "url",
                "description": "ini adalah Buku Perpan"
            },
            {
                "id": 2,
                "type": "elektronik",
                "name": "Resistor",
                "image": "url",
                "description": "komponen elektronik"
            }
        ],
        "alat": [
            {
                "id": 1,
                "name": "Mesin 3D Print",
                "image": "url",
                "description": "ini adalah 3D Print"
            }
        ]
    }
}
