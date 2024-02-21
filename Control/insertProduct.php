<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Lê o corpo da requisição
    $json = file_get_contents('php://input');

    // Decodifica o JSON para um array associativo
    $data = json_decode($json, true);

    //se conseguiu decodificar inicia o processo de inserção
    if ($data !== null) {
        $name   = $data['name'];
        $price  = str_replace(",",".",$data['price']);
        $qtd    = $data['qtd'];
        $image  = $data['image'];
        $date   = date("Y-m-d");
        
        include_once '../Model/connectDb.php';

        $connInsert = new connectDb();

        if ($connInsert->insert($name, $price, $qtd, $date, $image)) {
            echo json_encode(['success' => true, 'message' => 'Produto inserido com sucesso!']);
            
        } else {
            echo json_encode(['success' => false, 'message' => 'Falha ao inserir o Produto!']);
        }

    }else {
        http_response_code(400); //Bad Request
        echo json_encode(['success' => false, 'message' => 'Erro na decodificação do JSON']);

    }

}else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);

}

?>