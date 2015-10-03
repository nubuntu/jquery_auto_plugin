<?php
$mysqli = mysqli_connect('localhost', 'root', 'root', 'example_db');
if ($mysqli->connect_error) {
    die('Error : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
}

switch($_GET['autotable_action']){
    case 'get_records':
        $page               = $_GET['autotable_page'];
        $limit              = $_GET['autotable_limit'];
        $start              = ($page-1) * $limit;
        $q                  = "select * from tbl_students limit $start,$limit";
        $data['records']    = $mysqli->query($q)->fetch_all(MYSQLI_ASSOC);
        $data['total']      = $mysqli->query('select count(*) from tbl_students')->fetch_row();
        die(json_encode($data));
    break;
    case 'form_save':
        if($_POST['id']==null){
            # new record
            $q      = 'insert into tbl_students(name,city,date_of_birth,register_date,status) 
                    values ("'.$_POST['name'].'","'.$_POST['city'].'","'.$_POST['date_of_birth'].'","'.$_POST['register_date'].'","'.$_POST['status'].'")';
            $result = $mysqli->query($q);
            die($result);                     
        }else{
            # edit record
            $q      = 'update tbl_students set name="'.$_POST['name'].'",city="'.$_POST['city'].'",date_of_birth="'.$_POST['date_of_birth'].'",
                        register_date="'.$_POST['register_date'].'",status="'.$_POST['status'].'" 
                        where id="'.$_POST['id'].'"'; 
            $result = $mysqli->query($q);
            die($result);                     
        }
    break;    
    case 'form_delete':
        if($_POST['id']!=null){
            # new record
            $q      = 'delete from tbl_students where id='.$_POST['id']; 
            $result = $mysqli->query($q);
            die($result);                     
        }else{
            die(0);
        }    
    break;
}

?>