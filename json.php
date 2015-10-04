<?php
$mysqli = mysqli_connect('localhost', 'root', 'root', 'example_db');
if ($mysqli->connect_error) {
    die('Error : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
}

$post   = $_POST;

# clean post
if(count($post)>0){
    foreach($post as $key => $value){
        $post[$key] = is_array($value) ? $value : $mysqli->real_escape_string($value);    
    }
}

switch($post['autotable_action']){
    case 'get_records':
        $page               = $post['autotable_page'];
        $limit              = $post['autotable_limit'];
        $start              = ($page-1) * $limit;

        $where              = '';
        # if search 
        if(isset($post['autotable_search']) && strlen($post['autotable_search'])>=1){
            $set_option = function($field) use($post){
                switch($post['autotable_search_option']){
                    case 'equal':
                        return 'LOWER('.$field.')="'.strtolower($post['autotable_search']).'"';
                    break;
                    case 'contain':
                        return 'LOWER('.$field.') like "%'.strtolower($post['autotable_search']).'%"';
                    break;
                }
            };
            for($i=0;$i<count($post['autotable_search_list']);$i++){
                $field      = $post['autotable_search_list'][$i];
                $where[]    = $set_option($field);
            }
            if(count($where)>=1){
                $where = 'where '.implode(' or ',$where);                
            } 
        }    
        # end search
        
        $q                  = "select * from tbl_students $where limit $start,$limit";
        $data['records']    = $mysqli->query($q)->fetch_all(MYSQLI_ASSOC);
        $data['total']      = $mysqli->query("select count(*) from tbl_students $where")->fetch_row();
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