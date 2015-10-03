<?php
$mysqli = mysqli_connect('localhost', 'root', '', 'example_db');
if ($mysqli->connect_error) {
    die('Error : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
}

switch($_GET['autotable_action']){
    case 'get_records':
        $page               = $_GET['autotable_page'];
        $limit              = $_GET['autotable_limit'];
        $start              = ($page-1) * $limit;
        $q                  = "select * from tbl_siswa limit $start,$limit";
        $data['records']    = $mysqli->query($q)->fetch_all(MYSQLI_ASSOC);
        $data['total']      = $mysqli->query('select count(*) from tbl_siswa')->fetch_row();
        die(json_encode($data));
    break;
    case 'form_save':
        if($_POST['id']==null){
            # new record
            $q      = 'insert into tbl_siswa(nama,kota,tanggal_lahir,tanggal_daftar,status) 
                    values ("'.$_POST['nama'].'","'.$_POST['kota'].'","'.$_POST['tanggal_lahir'].'","'.$_POST['tanggal_daftar'].'","'.$_POST['status'].'")';
            $result = $mysqli->query($q);
            die($result);                     
        }else{
            # edit record
            $q      = 'update tbl_siswa set nama="'.$_POST['nama'].'",kota="'.$_POST['kota'].'",tanggal_lahir="'.$_POST['tanggal_lahir'].'",
                        tanggal_daftar="'.$_POST['tanggal_daftar'].'",status="'.$_POST['status'].'" 
                        where id="'.$_POST['id'].'"'; 
            $result = $mysqli->query($q);
            die($result);                     
        }
    break;    
    case 'form_delete':
        if($_POST['id']==null){
            # new record
            $q      = 'delete from tbl_siswa where id='.$_POST['id']; 
            $result = $mysqli->query($q);
            die($result);                     
        }else{
            die(0);
        }    
    break;
}

?>