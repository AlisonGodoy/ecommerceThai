<?php

include_once '../config.php';

class connectDb{
    protected $conn;
    protected $host;
    protected $port;
    protected $dbname;
    protected $user;
    protected $password;

    public function __construct(){
        $this->host = DB['hostname'];
        $this->port = DB['port'];
        $this->dbname = DB['dbname'];
        $this->user = DB['user'];
        $this->password = DB['password'];
        
        $this->conecta();
    }

    public function conecta(){

        try{
            $this->conn = new PDO("pgsql:host=$this->host;port=$this->port;dbname=$this->dbname", $this->user,$this->password);
                //echo "database conectado";
            if($this->conn){
                //echo "database conectado";
                
            }
        }catch (PDOException $e){
            echo $e->getMessage();
            
            
        } 
    }

    public function consulta($query, $params = []) {
        try {
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
            $statement = $this->conn->prepare($query);
            $statement->execute($params);
            
            return $statement->fetchAll(PDO::FETCH_OBJ);

        } catch (PDOException $e) {
            throw new Exception("Erro na consulta. Detalhes: " . $e->getMessage() . ". Query: " . $query);

        }
    }

    public function insert($name, $price, $qtd, $date, $image) {
        try {
            $sql = 'INSERT INTO product (description, price, quantity, datecad, image) VALUES (?, ?, ?, ?, ?)';
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$name, $price, $qtd, $date, $image]);

            return true; // Inserção bem-sucedida

        } catch (PDOException $e) {
            //echo 'Erro ao inserir produto: ' . $e->getMessage();
            return false; // Falha na inserção

        }
    }

}


?>