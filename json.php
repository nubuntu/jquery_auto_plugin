<?php
$mysqli = mysqli_connect('localhost', 'root', 'root', 'example_db');
if ($mysqli->connect_error) {
    die('Error : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
}

$post   = $_POST;
$get    = $_GET;

# clean post
if(count($post)>0){
    foreach($post as $key => $value){
        $post[$key] = $mysqli->real_escape_string($value);    
    }
}

# clean get
if(count($get)>0){
    foreach($get as $key => $value){
        $get[$key] = $mysqli->real_escape_string($value);    
    }
}

switch($get['autotable_action']){
    case 'get_records':
        $page               = $get['autotable_page'];
        $limit              = $get['autotable_limit'];
        $start              = ($page-1) * $limit;
        $q                  = "select * from tbl_students limit $start,$limit";
        $data['records']    = $mysqli->query($q)->fetch_all(MYSQLI_ASSOC);
        $data['total']      = $mysqli->query('select count(*) from tbl_students')->fetch_row();
        die(json_encode($data));
    break;
    case 'form_save':
        if($post['id']==null){
            # new record
            $q      = 'insert into tbl_students(name,city,date_of_birth,register_date,status) 
                    values ("'.$post['name'].'","'.$post['city'].'","'.$post['date_of_birth'].'","'.$post['register_date'].'","'.$post['status'].'")';
            $result = $mysqli->query($q);
            die($result);                     
        }else{
            # edit record
            $q      = 'update tbl_students set name="'.$post['name'].'",city="'.$post['city'].'",date_of_birth="'.$post['date_of_birth'].'",
                        register_date="'.$post['register_date'].'",status="'.$post['status'].'" 
                        where id="'.$post['id'].'"'; 
            $result = $mysqli->query($q);
            die($result);                     
        }
    break;    
    case 'form_delete':
        if($post['id']!=null){
            # new record
            $q      = 'delete from tbl_students where id='.$post['id']; 
            $result = $mysqli->query($q);
            die($result);                     
        }else{
            die(0);
        }    
    break;
}

?>